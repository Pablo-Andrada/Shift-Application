import { Router } from "express";
import { createCredentialController, validateCredentialController } from "../controllers/credentialsController";

export const credentialsRouter = Router();

// POST /credentials/register → Crear un nuevo par de credenciales
credentialsRouter.post("/register", createCredentialController);

// POST /credentials/login → Validar credenciales (por ejemplo, para login)
credentialsRouter.post("/login", validateCredentialController);

export default credentialsRouter;
