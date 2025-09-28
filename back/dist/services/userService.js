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
exports.getUserByCredentialIdService = getUserByCredentialIdService;
const data_source_1 = require("../config/data-source");
// Función para crear un nuevo usuario
const createUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.UserModel.create(userData);
    const result = yield data_source_1.UserModel.save(user);
    return user;
});
exports.createUserService = createUserService;
// Función para obtener todos los usuarios, incluyendo sus turnos.
const getUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield data_source_1.UserModel.find({
        relations: { appointments: true }
    });
    return users;
});
exports.getUsersService = getUsersService;
// Función para obtener un usuario específico por su ID, incluyendo sus turnos.
const getUserByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.UserModel.findOne({
        where: { id },
        relations: { appointments: true }
    });
    return user;
});
exports.getUserByIdService = getUserByIdService;
// Función para eliminar un usuario.
const deleteUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.UserModel.delete({ id });
});
exports.deleteUserService = deleteUserService;
/**
 * Obtiene un usuario basado en el ID de sus credenciales.
 * Se usa para el login, de manera que si las credenciales son válidas,
 * se busque y retorne el objeto usuario completo asociado a esas credenciales.
 * @param credentialId - El ID de las credenciales.
 * @returns El objeto usuario o null si no se encuentra.
 */
function getUserByCredentialIdService(credentialId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Usamos findOne para permitir incluir relaciones si es necesario.
        // Si querés incluir, por ejemplo, la relación con las credenciales y los turnos, podés descomentar relations.
        return yield data_source_1.UserModel.findOne({
            where: { credentialsId: credentialId },
            relations: ["credential", "appointments"] // Opcional: incluye relaciones si las necesitás.
        });
    });
}
// Código viejo comentado que no se modifica...
// import { IAppointment } from '../interfaces/IAppointment';
// ... (resto del código viejo) ...
