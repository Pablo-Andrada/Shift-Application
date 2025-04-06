import { CredentialModel } from "../config/data-source";
import { Credential } from "../entities/Credential";
import { User } from "../entities/User"; // Importamos la entidad User para poder retornar el objeto usuario

/**
 * Crea un nuevo par de credenciales en la base de datos.
 * En producción, deberías hashear la contraseña (por ejemplo, usando bcrypt).
 * @param username - El nombre de usuario.
 * @param password - La contraseña en texto plano.
 * @returns El ID de la credencial creada.
 */
export async function createCredential(username: string, password: string): Promise<number> {
  // Crear la instancia de Credential usando el repositorio.
  const newCredential: Credential = CredentialModel.create({
    username,
    password, // Recuerda hashear la contraseña en producción.
  });

  // Guardar la credencial en la base de datos.
  await CredentialModel.save(newCredential);
  
  // Retornar el ID de la nueva credencial.
  return newCredential.id;
}

/**
 * Valida las credenciales proporcionadas.
 * Compara el username y password con lo que hay en la base de datos.
 * En producción, utiliza bcrypt.compare() para contraseñas hasheadas.
 * @param username - El nombre de usuario a validar.
 * @param password - La contraseña a validar.
 * @returns El ID de la credencial si la validación es exitosa, o null si falla.
 */
export async function validateCredential(username: string, password: string): Promise<number | null> {
  // Buscar la credencial en la base de datos por username.
  const credential: Credential | null = await CredentialModel.findOneBy({ username });
  
  if (!credential) {
    // Si no se encuentra, retorna null.
    return null;
  }
  
  // Comparar la contraseña.
  // En producción, reemplazar por bcrypt.compare(password, credential.password)
  if (credential.password === password) {
    // Validación exitosa: retornamos el ID de la credencial.
    return credential.id;
  }
  
  // Contraseña incorrecta, retornamos null.
  return null;
}

/**
 * Realiza el proceso de login para las credenciales.
 * Primero valida las credenciales usando validateCredential.
 * Si la validación es exitosa, se busca la credencial incluyendo la relación con el usuario,
 * y se retorna el objeto usuario asociado.
 * @param username - El nombre de usuario.
 * @param password - La contraseña.
 * @returns El objeto usuario si la autenticación es exitosa, o null si falla.
 */
export async function loginCredentialService(username: string, password: string): Promise<User | null> {
  // Validamos las credenciales. Si fallan, retornamos null.
  const credentialId = await validateCredential(username, password);
  
  if (!credentialId) {
    return null;
  }
  
  // Buscamos la credencial en la base de datos, incluyendo la relación con el usuario.
  // Esto nos permite obtener el objeto usuario asociado a estas credenciales.
  const credential = await CredentialModel.findOne({
    where: { username },
    relations: ["user"], // Asegúrate de que la entidad Credential tenga definida la relación con User.
  });
  
  // Si no se encontró la credencial o no hay usuario asociado, retornamos null.
  if (!credential || !credential.user) {
    return null;
  }
  
  // Si todo está bien, retornamos el objeto usuario.
  return credential.user;
}
