import { CredentialModel } from "../config/data-source";
import { Credential } from "../entities/Credential";

// Función para crear un nuevo par de credenciales en la base de datos.
// En un caso real, se debería hashear la contraseña (por ejemplo, con bcrypt).
export async function createCredential(username: string, password: string): Promise<number> {
  // Crear la instancia de Credential usando el repositorio.
  const newCredential = CredentialModel.create({
    username,
    password, // Asegurate de hashear la contraseña en producción.
  });

  // Guardar la credencial en la base de datos.
  await CredentialModel.save(newCredential);
  
  // Retornar el ID de la nueva credencial.
  return newCredential.id;
}

// Función para validar credenciales. Retorna el ID de la credencial si es válida, o null si no lo es.
export async function validateCredential(username: string, password: string): Promise<number | null> {
  // Buscar la credencial en la base de datos por username.
  const credential = await CredentialModel.findOneBy({ username });
  
  if (!credential) {
    // Usuario no encontrado.
    return null;
  }
  
  // Comparar la contraseña.
  // En producción, usar bcrypt.compare() si la contraseña está hasheada.
  if (credential.password === password) {
    return credential.id;
  }
  
  // Contraseña incorrecta.
  return null;
}





// import { ICredential } from '../interfaces/ICredential';

// // Precarga de datos
// let credentials: ICredential[] = [
//   { id: 1, username: 'user1', password: 'hashedPassword1' },
//   { id: 2, username: 'user2', password: 'hashedPassword2' },
// ];

// // Generador de ID único
// let nextCredentialId = credentials.length + 1;

// // Función para crear un nuevo par de credenciales
// export function createCredential(username: string, password: string): number {
//   const newCredential: ICredential = {
//     id: nextCredentialId++,
//     username,
//     password, // Asegúrate de hashear la contraseña antes de guardarla
//   };

//   credentials.push(newCredential);
//   return newCredential.id;
// }

// // Función para validar credenciales
// export function validateCredential(username: string, password: string): number | null {
//   const credential = credentials.find((cred) => cred.username === username);

//   if (!credential) {
//     return null; // Usuario no encontrado
//   }

//   if (credential.password === password) {
//     // Aquí deberías comparar contraseñas usando bcrypt si están hasheadas
//     return credential.id; // Validación exitosa
//   }

//   return null; // Contraseña incorrecta.
// }
