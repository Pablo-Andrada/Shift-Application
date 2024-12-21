import { IUser } from '../interfaces/IUser';
import { createCredential } from './credentialService';

// Precarga de datos
let users: IUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    birthdate: new Date('1990-01-01'),
    nDni: '12345678',
    credentialsId: 1,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    birthdate: new Date('1985-05-15'),
    nDni: '87654321',
    credentialsId: 2,
  },
];

// Generador de ID único
let nextUserId = users.length + 1;

// Función para retornar el arreglo completo de usuarios
export function getAllUsers(): IUser[] {
  return users;
}

// Función para retornar un usuario por ID
export function getUserById(id: number): IUser | null {
  const user = users.find((user) => user.id === id);
  return user || null;
}

// Función para crear un nuevo usuario
export function createUser(
  name: string,
  email: string,
  birthdate: Date,
  nDni: string,
  username: string,
  password: string
): IUser {
  // Crear credenciales para el nuevo usuario
  const credentialsId = createCredential(username, password);

  // Crear nuevo usuario
  const newUser: IUser = {
    id: nextUserId++,
    name,
    email,
    birthdate,
    nDni,
    credentialsId,
  };

  users.push(newUser);
  return newUser;
}
