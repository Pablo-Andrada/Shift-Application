// src/controllers/usersController.ts
import { Request, Response } from "express";
import { 
  createUserService,
  getUsersService,
  getUserByIdService,
  deleteUserService,
  getUserByCredentialIdService
} from "../services/userService";
import { validateCredential, createCredential } from "../services/credentialService"; // Importamos createCredential
import { User } from "../entities/User";

/**
 * POST /users/register => Registro de un nuevo usuario.
 * Recibe del body: name, email, birthdate, nDni y password.
 * Primero crea las credenciales usando el password y luego crea el usuario utilizando el ID de las credenciales generadas.
 * Retorna el objeto usuario creado.
 */
export const createUserController = async (req: Request, res: Response) => {
  // Extraemos los datos necesarios del body; ahora se espera que el campo "password" esté presente.
  const { name, email, birthdate, nDni, password } = req.body;
  
  // Validación básica para asegurarnos de que se envíe el password.
  if (!password) {
    return res.status(400).json({ message: "El campo 'password' es obligatorio." });
  }
  
  try {
    // Primero, creamos las credenciales utilizando el email y el password.
    // La función createCredential se encargará de hashear la contraseña en producción y retornar el ID generado.
    const credentialId = await createCredential(email, password);
    
    // Luego, creamos el usuario utilizando el credentialId generado.
    const newUser: User = await createUserService({ name, email, birthdate, nDni, credentialsId: credentialId });
    
    // Retornamos el usuario creado.
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
 * POST /users/login => Login del usuario a la aplicación.
 * Este controlador utiliza las credenciales para autenticar al usuario.
 * Se espera recibir en el body: { username, password }.
 * Primero valida las credenciales usando validateCredential y, si son válidas,
 * utiliza getUserByCredentialIdService para obtener el usuario asociado.
 * Si el login es exitoso, retorna el objeto usuario (con la propiedad user) que se usará en el frontend.
 */
export const createLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Por favor complete todos los campos." });
    }

    const credentialId = await validateCredential(username, password);

    if (!credentialId) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const user = await getUserByCredentialIdService(credentialId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.status(200).json({ message: "Login exitoso.", user });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
};
