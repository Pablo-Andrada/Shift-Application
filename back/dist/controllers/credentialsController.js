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
exports.validateCredentialController = exports.createCredentialController = void 0;
const credentialService_1 = require("../services/credentialService");
/**
 * POST /credentials/register
 * Crea un nuevo par de credenciales.
 */
const createCredentialController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // En producción, recordá hashear la contraseña antes de guardarla.
        const credentialId = yield (0, credentialService_1.createCredential)(username, password);
        return res.status(201).json({
            message: "Credencial creada exitosamente",
            id: credentialId
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error al crear la credencial",
            error,
        });
    }
});
exports.createCredentialController = createCredentialController;
/**
 * POST /credentials/login
 * Valida las credenciales proporcionadas (por ejemplo, para el login).
 */
const validateCredentialController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const credentialId = yield (0, credentialService_1.validateCredential)(username, password);
        if (!credentialId) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        return res.status(200).json({
            message: "Credenciales válidas",
            id: credentialId
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error al validar las credenciales",
            error,
        });
    }
});
exports.validateCredentialController = validateCredentialController;
