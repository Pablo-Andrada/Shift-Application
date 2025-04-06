// src/routes/usersRouter.ts
import { Router } from "express";
import { 
  getUsersController,
  getUserByIdController,
  createUserController,
  createLogin,
  deleteUserController
} from "../controllers/usersController";

export const usersRouter = Router();

// GET /user => Obtiene el listado de todos los usuarios
usersRouter.get("/", getUsersController);

// GET /user/:id => Obtiene el detalle de un usuario específico
usersRouter.get("/:id", getUserByIdController);

// POST /user/register => Registro de un nuevo usuario
usersRouter.post("/register", createUserController);

// POST /user/login => Login del usuario a la aplicación
usersRouter.post("/login", createLogin);

// DELETE /user => Elimina un usuario
usersRouter.delete("/", deleteUserController);
