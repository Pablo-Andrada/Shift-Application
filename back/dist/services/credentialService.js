"use strict";
// src/services/credentialService.ts
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
exports.createCredential = createCredential;
exports.validateCredential = validateCredential;
exports.loginCredentialService = loginCredentialService;
const data_source_1 = require("../config/data-source");
/**
 * Crea un nuevo par de credenciales en la base de datos.
 * En producción, deberías hashear la contraseña (por ejemplo, usando bcrypt).
 *
 * @param username - El nombre de usuario.
 * @param password - La contraseña en texto plano.
 * @returns El ID de la credencial creada.
 */
function createCredential(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Crear la instancia de Credential usando el repositorio.
        const newCredential = data_source_1.CredentialModel.create({
            username,
            password, // Recuerda hashear la contraseña en producción.
        });
        // Guardamos la credencial en la base de datos.
        yield data_source_1.CredentialModel.save(newCredential);
        // Retornamos el ID de la nueva credencial.
        return newCredential.id;
    });
}
/**
 * Valida las credenciales proporcionadas.
 * Compara el username y password con lo que hay en la base de datos.
 * En producción, utiliza bcrypt.compare() para contraseñas hasheadas.
 *
 * @param username - El nombre de usuario a validar.
 * @param password - La contraseña a validar.
 * @returns El ID de la credencial si la validación es exitosa, o null si falla.
 */
function validateCredential(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Buscamos la credencial en la base de datos por username.
        const credential = yield data_source_1.CredentialModel.findOneBy({ username });
        if (!credential) {
            // Si no se encuentra, retornamos null.
            return null;
        }
        // Comparamos la contraseña.
        // En producción, reemplazar por bcrypt.compare(password, credential.password)
        if (credential.password === password) {
            // Validación exitosa: retornamos el ID de la credencial.
            return credential.id;
        }
        // Si la contraseña es incorrecta, retornamos null.
        return null;
    });
}
/**
 * Realiza el proceso de login para las credenciales.
 * Primero valida las credenciales usando validateCredential. Si la validación es exitosa,
 * se busca la credencial en la base de datos incluyendo la relación con el usuario y se retorna
 * el objeto usuario asociado.
 *
 * @param username - El nombre de usuario.
 * @param password - La contraseña.
 * @returns El objeto usuario si la autenticación es exitosa, o null si falla.
 */
function loginCredentialService(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validamos las credenciales. Si fallan, retornamos null.
        const credentialId = yield validateCredential(username, password);
        if (!credentialId) {
            return null;
        }
        // Buscamos la credencial en la base de datos, incluyendo la relación con el usuario.
        // Esto nos permite obtener el objeto usuario asociado a estas credenciales.
        const credential = yield data_source_1.CredentialModel.findOne({
            where: { username },
            relations: ["user"], // Asegúrate de que la entidad Credential tenga definida la relación con User.
        });
        // Si no se encontró la credencial o no existe usuario asociado, retornamos null.
        if (!credential || !credential.user) {
            return null;
        }
        // Si todo está correcto, retornamos el objeto usuario.
        return credential.user;
    });
}
