"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialsRouter = void 0;
const express_1 = require("express");
const credentialsController_1 = require("../controllers/credentialsController");
exports.credentialsRouter = (0, express_1.Router)();
// POST /credentials/register → Crear un nuevo par de credenciales
exports.credentialsRouter.post("/register", credentialsController_1.createCredentialController);
// POST /credentials/login → Validar credenciales (por ejemplo, para login)
exports.credentialsRouter.post("/login", credentialsController_1.validateCredentialController);
exports.default = exports.credentialsRouter;
