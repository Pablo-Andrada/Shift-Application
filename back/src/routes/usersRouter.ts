import { Router } from "express";
import {getUsersController,getUserByIdController,createUserController,createLogin, deleteUserController} from "../controllers/usersController"

export const usersRouter = Router();

usersRouter.get("/", getUsersController);
usersRouter.get("/:id", getUserByIdController);
usersRouter.post("/register", createUserController);
usersRouter.post("/login", createLogin)
usersRouter.delete("/",deleteUserController)


