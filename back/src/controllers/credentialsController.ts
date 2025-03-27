import { Request, Response, RequestHandler } from "express";
import { createCredential, validateCredential } from "../services/credentialService";

/**
 * POST /credentials/register
 * Crea un nuevo par de credenciales.
 */
export const createCredentialController: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    // En producción, recordá hashear la contraseña antes de guardarla.
    const credentialId = await createCredential(username, password);
    return res.status(201).json({ 
      message: "Credencial creada exitosamente", 
      id: credentialId 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la credencial",
      error,
    });
  }
};

/**
 * POST /credentials/login
 * Valida las credenciales proporcionadas (por ejemplo, para el login).
 */
export const validateCredentialController: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const credentialId = await validateCredential(username, password);
    if (!credentialId) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    return res.status(200).json({ 
      message: "Credenciales válidas", 
      id: credentialId 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al validar las credenciales",
      error,
    });
  }
};
