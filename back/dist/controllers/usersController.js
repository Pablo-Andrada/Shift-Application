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
// POST /users/register => Registro de un nuevo usuario.
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, birthdate, nDni, credentialsId } = req.body;
    try {
        const newUser = yield (0, userService_1.createUserService)({ name, email, birthdate, nDni, credentialsId });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: "Error al crear el usuario", error });
    }
});
exports.createUserController = createUserController;
// name: string;   
// email: string;   
// age: number;
// birthdate: Date;
// active: boolean;
// nDni: string;
//GET /users => Obtener el listado de todos los usuarios.
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
//GET /users/:id => Obtener el detalle de un usuario específico.
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
//POST /users/login => Login del usuario a la aplicación.
const createLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "Login del usuario a la aplicación" });
});
exports.createLogin = createLogin;
