import { Request, Response } from "express";
import { createUserService } from "../services/userService";

//GET /users => Obtener el listado de todos los usuarios.
export const getUsers = async (req:Request,res:Response) => {
    res.status(200).json({message:"listado de todos los usuarios"})
}
//GET /users/:id => Obtener el detalle de un usuario específico.
export const getUserId = async(req:Request,res:Response) => {
    res.status(200).json({message:"detalle de un usuario específico"})
}

// POST /users/register => Registro de un nuevo usuario.
export const createUserController = async (req: Request, res: Response) => {
    const { name, email, birthdate, nDni, username, password } = req.body;
    
    try {
      const newUser = createUserService(
        name,
        email,
        new Date(birthdate),
        nDni,
        username,
        password
      );
      res.status(201).json({ message: "Usuario creado", data: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  };

//POST /users/login => Login del usuario a la aplicación.
export const createLogin = async (req:Request,res:Response) => {
    res.status(200).json({message:"Login del usuario a la aplicación"});
}