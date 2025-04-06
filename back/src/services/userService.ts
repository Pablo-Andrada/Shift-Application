import { IUser } from '../interfaces/IUser';
import { createCredential } from './credentialService';
import UserDto from "../dtos/UserDto";
import { User } from '../entities/User';
import { UserModel } from '../config/data-source';

// Función para crear un nuevo usuario
export const createUserService = async (userData: UserDto): Promise<User> => {
  const user = await UserModel.create(userData);
  const result = await UserModel.save(user);
  return user;
}

// Función para obtener todos los usuarios, incluyendo sus turnos.
export const getUsersService = async (): Promise<User[]> => {
  const users = await UserModel.find({
    relations: { appointments: true }
  });
  return users;
}

// Función para obtener un usuario específico por su ID, incluyendo sus turnos.
export const getUserByIdService = async (id: number): Promise<User | null> => {
  const user = await UserModel.findOne({
    where: { id },
    relations: { appointments: true }
  });
  return user;
}

// Función para eliminar un usuario.
export const deleteUserService = async (id: number): Promise<void> => {
  await UserModel.delete({ id });
}

/**
 * Obtiene un usuario basado en el ID de sus credenciales.
 * Se usa para el login, de manera que si las credenciales son válidas,
 * se busque y retorne el objeto usuario completo asociado a esas credenciales.
 * @param credentialId - El ID de las credenciales.
 * @returns El objeto usuario o null si no se encuentra.
 */
export async function getUserByCredentialIdService(credentialId: number): Promise<User | null> {
  // Usamos findOne para permitir incluir relaciones si es necesario.
  // Si querés incluir, por ejemplo, la relación con las credenciales y los turnos, podés descomentar relations.
  return await UserModel.findOne({
    where: { credentialsId: credentialId },
    relations: ["credential", "appointments"] // Opcional: incluye relaciones si las necesitás.
  });
}

// Código viejo comentado que no se modifica...
// import { IAppointment } from '../interfaces/IAppointment';
// ... (resto del código viejo) ...
