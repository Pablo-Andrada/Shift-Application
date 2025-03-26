import { Router } from "express";
import {getUsers,getUserId,createUserController,createLogin} from "../controllers/usersController"

export const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/id", getUserId);
usersRouter.post("/register", createUserController);
usersRouter.post("/login",createLogin)


