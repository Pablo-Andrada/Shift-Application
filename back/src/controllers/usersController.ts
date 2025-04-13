// src/controllers/usersController.ts
import { Request, Response } from "express";
import {
  createUserService,
  getUsersService,
  getUserByIdService,
  deleteUserService,
  getUserByCredentialIdService
} from "../services/userService";
import { createCredential } from "../services/credentialService"; // para registro
import { CredentialModel } from "../config/data-source";           // para login directo
import { User } from "../entities/User";

/**
 * POST /user/register => Registro de un nuevo usuario.
 * Recibe del body: name, email, birthdate, nDni y password.
 * Primero crea las credenciales usando el email y luego crea el usuario.
 */
export const createUserController = async (req: Request, res: Response) => {
  const { name, email, birthdate, nDni, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "El campo 'password' es obligatorio." });
  }
  try {
    const credentialId = await createCredential(email, password);
    const newUser: User = await createUserService({ name, email, birthdate, nDni, credentialsId: credentialId });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el usuario", error });
  }
};

/**
 * GET /users => Obtener el listado de todos los usuarios.
 */
export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users: User[] = await getUsersService();
    res.status(200).json({ users });
  } catch (error) {
    res.status(404).json({ message: "Error al traer los usuarios", error });
  }
};

/**
 * GET /users/:id => Obtener el detalle de un usuario específico.
 */
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: User | null = await getUserByIdService(Number(id));
    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({ message: "Usuario inexistente", error });
  }
};

/**
 * DELETE /users => Eliminar un usuario.
 */
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await deleteUserService(id);
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(404).json({ message: "Error al borrar usuario", error });
  }
};

/**
 * POST /user/login => Login del usuario a la aplicación.
 * Ahora espera en el body: { email, password }.
 * 1) Busca la credencial más reciente donde username = email.
 * 2) Compara la contraseña (texto plano).
 * 3) Obtiene el usuario asociado y lo devuelve.
 */
export const createLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Por favor complete todos los campos." });
    }

    // 1) Buscamos la credencial más reciente para este email.
    //    Así, si existe más de una fila con el mismo username,
    //    tomamos la de mayor ID (la última creada).
    const credential = await CredentialModel.findOne({
      where: { username: email },
      order: { id: "DESC" }
    });

    if (!credential) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // 2) Validamos la contraseña (en producción, usar bcrypt.compare)
    if (credential.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // 3) Obtenemos el usuario asociado a esas credenciales
    const user = await getUserByCredentialIdService(credential.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.status(200).json({ message: "Login exitoso.", user });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
};