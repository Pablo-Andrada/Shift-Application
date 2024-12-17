import { Router } from "express";
import {getUsers,getUserId,createUser,createLogin} from "../controllers/usersController"

export const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/id", getUserId);
usersRouter.post("/register", createUser);
usersRouter.post("/login",createLogin)


