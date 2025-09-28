"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
// src/routes/usersRouter.ts
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
exports.usersRouter = (0, express_1.Router)();
// GET /user => Obtiene el listado de todos los usuarios
exports.usersRouter.get("/", usersController_1.getUsersController);
// GET /user/:id => Obtiene el detalle de un usuario específico
exports.usersRouter.get("/:id", usersController_1.getUserByIdController);
// POST /user/register => Registro de un nuevo usuario
exports.usersRouter.post("/register", usersController_1.createUserController);
// POST /user/login => Login del usuario a la aplicación
exports.usersRouter.post("/login", usersController_1.createLogin);
// DELETE /user => Elimina un usuario
exports.usersRouter.delete("/", usersController_1.deleteUserController);
