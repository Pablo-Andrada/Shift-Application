import { IUser } from '../interfaces/IUser';
import { createCredential } from './credentialService';
import UserDto from "../dtos/UserDto";
import { User } from '../entities/User';
import { UserModel } from '../config/data-source';

let users: IUser[] = [];
let id: number = 1;

// Función para crear un nuevo usuario
export const createUserService = async (userData: UserDto): Promise<User> => {
  const user = await UserModel.create(userData);
  const result = await UserModel.save(user);
  return user;
}

export const getUsersService = async ():Promise<User[]> => {
  const users = await UserModel.find({
    relations: {
      appointments:true
    }
  })
  return users;
}

export const getUserByIdService = async(id:number):Promise<User|null> => {
  const user = await UserModel.findOneBy({ id });
  return user;
}

export const deleteUserService = async (id:number):Promise<void> => {
  users = users.filter((user:IUser) => {
    return user.id !== id;
  })
}
// // Generador de ID único
// let nextUserId = users.length + 1;

// // Función para retornar el arreglo completo de usuarios
// export function getAllUsers(): IUser[] {
//   return users;
// }

// // Función para retornar un usuario por ID
// export function getUserById(id: number): IUser | null {
//   const user = users.find((user) => user.id === id);
//   return user || null;
// }

