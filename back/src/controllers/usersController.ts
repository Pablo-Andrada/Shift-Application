import { Request, Response } from "express";
import { createUserService ,getUsersService,getUserByIdService,deleteUserService} from "../services/userService";
import { User } from "../entities/User";

// POST /users/register => Registro de un nuevo usuario.
export const createUserController = async (req: Request, res: Response) => {
    const { name, email, birthdate, nDni, age, active } = req.body;
    
    try {
      const newUser: User = await createUserService({ name, email, birthdate, nDni, age, active });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
};
  
// name: string;   
// email: string;   
// age: number;
// birthdate: Date;
// active: boolean;
// nDni: string;
//GET /users => Obtener el listado de todos los usuarios.
export const getUsers = async (req:Request,res:Response) => {
    res.status(200).json({message:"listado de todos los usuarios"})
}
//GET /users/:id => Obtener el detalle de un usuario específico.
export const getUserId = async(req:Request,res:Response) => {
    res.status(200).json({message:"detalle de un usuario específico"})
  }
  

//POST /users/login => Login del usuario a la aplicación.
export const createLogin = async (req:Request,res:Response) => {
    res.status(200).json({message:"Login del usuario a la aplicación"});
}