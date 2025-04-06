// src/controllers/usersController.ts
import { Request, Response } from "express";
import { 
  createUserService,
  getUsersService,
  getUserByIdService,
  deleteUserService,
  getUserByCredentialIdService // Asegurate de tener esta función en userService.ts
} from "../services/userService";
import { validateCredential } from "../services/credentialService"; // Función que valida credenciales y retorna el ID si es válida
import { User } from "../entities/User";

/**
 * POST /users/register => Registro de un nuevo usuario.
 * Recibe del body: name, email, birthdate, nDni y credentialsId.
 * Crea un nuevo usuario y devuelve el objeto creado.
 */
export const createUserController = async (req: Request, res: Response) => {
  const { name, email, birthdate, nDni, credentialsId } = req.body;
  
  try {
    const newUser: User = await createUserService({ name, email, birthdate, nDni, credentialsId });
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
    // Extraemos username y password del body.
    const { username, password } = req.body;

    // Validamos que ambos campos estén presentes.
    if (!username || !password) {
      return res.status(400).json({ message: "Por favor complete todos los campos." });
    }

    // Validamos las credenciales; validateCredential retorna el ID de la credencial si es válida.
    const credentialId = await validateCredential(username, password);

    if (!credentialId) {
      // Si la validación falla, retornamos un error 401.
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Obtenemos el usuario asociado a estas credenciales.
    // La función getUserByCredentialIdService debe buscar en la tabla de usuarios donde el campo credentialsId coincida.
    const user = await getUserByCredentialIdService(credentialId);

    if (!user) {
      // Si no se encuentra el usuario, retornamos un error 404.
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Login exitoso: retornamos un objeto con un mensaje y el objeto usuario.
    return res.status(200).json({ message: "Login exitoso.", user });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
};
