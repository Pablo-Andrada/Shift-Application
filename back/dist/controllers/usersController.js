"use strict";
// // src/controllers/usersController.ts
// import { Request, Response } from "express";
// import {
//   createUserService,
//   getUsersService,
//   getUserByIdService,
//   deleteUserService,
//   getUserByCredentialIdService
// } from "../services/userService";
// import { createCredential } from "../services/credentialService"; // para registro
// import { CredentialModel } from "../config/data-source";           // para login directo
// import { User } from "../entities/User";
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
 * Recibe del body: name, email, birthdate, nDni (o dni) y password.
 * Primero crea las credenciales usando el email y luego crea el usuario.
 */
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Aceptar tanto nDni como dni (por si el front manda uno u otro)
    const { name, email, birthdate, nDni, dni, password } = req.body;
    // Unificamos a una sola variable que vamos a pasar al service/entidad
    const nDniValue = (_a = nDni !== null && nDni !== void 0 ? nDni : dni) !== null && _a !== void 0 ? _a : null;
    // LOG mínimo para ver qué llega (sin mostrar password en claro)
    console.log('POST /user/register - body:', { name, email, birthdate, nDni: nDniValue });
    if (!password) {
        return res.status(400).json({ message: "El campo 'password' es obligatorio." });
    }
    try {
        // Creamos las credenciales y obtenemos el id
        const credentialId = yield (0, credentialService_1.createCredential)(email, password);
        // Llamamos al service pasando nDni unificado
        const newUser = yield (0, userService_1.createUserService)({
            name,
            email,
            birthdate,
            nDni: nDniValue,
            credentialsId: credentialId
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        // Log detallado (útil para ver el detalle de Postgres/TypeORM sin romper respuesta al front)
        const err = error;
        console.error('ERROR Registro:', {
            message: err === null || err === void 0 ? void 0 : err.message,
            code: err === null || err === void 0 ? void 0 : err.code,
            detail: ((_b = err === null || err === void 0 ? void 0 : err.driverError) === null || _b === void 0 ? void 0 : _b.detail) || (err === null || err === void 0 ? void 0 : err.detail),
            query: err === null || err === void 0 ? void 0 : err.query,
            parameters: err === null || err === void 0 ? void 0 : err.parameters
        });
        return res.status(400).json({ message: "Error al crear el usuario", reason: ((_c = err === null || err === void 0 ? void 0 : err.driverError) === null || _c === void 0 ? void 0 : _c.detail) || (err === null || err === void 0 ? void 0 : err.message) });
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
