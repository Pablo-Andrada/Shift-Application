import { ICredential } from '../interfaces/ICredential';

// Precarga de datos
let credentials: ICredential[] = [
  { id: 1, username: 'user1', password: 'hashedPassword1' },
  { id: 2, username: 'user2', password: 'hashedPassword2' },
];

// Generador de ID único
let nextCredentialId = credentials.length + 1;

// Función para crear un nuevo par de credenciales
export function createCredential(username: string, password: string): number {
  const newCredential: ICredential = {
    id: nextCredentialId++,
    username,
    password, // Asegúrate de hashear la contraseña antes de guardarla
  };

  credentials.push(newCredential);
  return newCredential.id;
}

// Función para validar credenciales
export function validateCredential(username: string, password: string): number | null {
  const credential = credentials.find((cred) => cred.username === username);

  if (!credential) {
    return null; // Usuario no encontrado
  }

  if (credential.password === password) {
    // Aquí deberías comparar contraseñas usando bcrypt si están hasheadas
    return credential.id; // Validación exitosa
  }

  return null; // Contraseña incorrecta.
}
