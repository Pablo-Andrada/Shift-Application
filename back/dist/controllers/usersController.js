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
exports.createLogin = exports.deleteUserController = exports.getUserByIdController = exports.getUsersController = exports.createUserController = void 0;
const userService_1 = require("../services/userService");
const credentialService_1 = require("../services/credentialService"); // para registro
const data_source_1 = require("../config/data-source"); // para login directo
/**
 * POST /user/register => Registro de un nuevo usuario.
 * Recibe del body: name, email, birthdate, nDni y password.
 * Primero crea las credenciales usando el email y luego crea el usuario.
 */
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, birthdate, nDni, password } = req.body;
    if (!password) {
        return res.status(400).json({ message: "El campo 'password' es obligatorio." });
    }
    try {
        const credentialId = yield (0, credentialService_1.createCredential)(email, password);
        const newUser = yield (0, userService_1.createUserService)({ name, email, birthdate, nDni, credentialsId: credentialId });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: "Error al crear el usuario", error });
    }
});
exports.createUserController = createUserController;
/**
 * GET /users => Obtener el listado de todos los usuarios.
 */
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getUsersService)();
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(404).json({ message: "Error al traer los usuarios", error });
    }
});
exports.getUsersController = getUsersController;
/**
 * GET /users/:id => Obtener el detalle de un usuario específico.
 */
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield (0, userService_1.getUserByIdService)(Number(id));
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(404).json({ message: "Usuario inexistente", error });
    }
});
exports.getUserByIdController = getUserByIdController;
/**
 * DELETE /users => Eliminar un usuario.
 */
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield (0, userService_1.deleteUserService)(id);
        res.status(200).json({ message: "Usuario eliminado con éxito" });
    }
    catch (error) {
        res.status(404).json({ message: "Error al borrar usuario", error });
    }
});
exports.deleteUserController = deleteUserController;
/**
 * POST /user/login => Login del usuario a la aplicación.
 * Ahora espera en el body: { email, password }.
 * 1) Busca la credencial más reciente donde username = email.
 * 2) Compara la contraseña (texto plano).
 * 3) Obtiene el usuario asociado y lo devuelve.
 */
const createLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Por favor complete todos los campos." });
        }
        // 1) Buscamos la credencial más reciente para este email.
        //    Así, si existe más de una fila con el mismo username,
        //    tomamos la de mayor ID (la última creada).
        const credential = yield data_source_1.CredentialModel.findOne({
            where: { username: email },
            order: { id: "DESC" }
        });
        if (!credential) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        // 2) Validamos la contraseña (en producción, usar bcrypt.compare)
        if (credential.password !== password) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        // 3) Obtenemos el usuario asociado a esas credenciales
        const user = yield (0, userService_1.getUserByCredentialIdService)(credential.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        return res.status(200).json({ message: "Login exitoso.", user });
    }
    catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error al iniciar sesión.", error });
    }
});
exports.createLogin = createLogin;
