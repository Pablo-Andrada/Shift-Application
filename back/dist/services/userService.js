"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.getUserByIdService = exports.getUsersService = exports.createUserService = void 0;
const data_source_1 = require("../config/data-source");
// let users: IUser[] = [];
// let id: number = 1;
// Función para crear un nuevo usuario
const createUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.UserModel.create(userData);
    const result = yield data_source_1.UserModel.save(user);
    return user;
});
exports.createUserService = createUserService;
const getUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield data_source_1.UserModel.find({
        relations: {
            appointments: true
        }
    });
    return users;
});
exports.getUsersService = getUsersService;
// export const getUserByIdService = async(id:number):Promise<User|null> => {
//   const user = await UserModel.findOneBy({ id });
//   return user;
// }
const getUserByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.UserModel.findOne({
        where: { id },
        relations: { appointments: true }
    });
    return user;
});
exports.getUserByIdService = getUserByIdService;
const deleteUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.UserModel.delete({ id });
});
exports.deleteUserService = deleteUserService;
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
