import { Request, Response } from "express";
import { createUserService ,getUsersService,getUserByIdService,deleteUserService} from "../services/userService";
import { User } from "../entities/User";

// POST /users/register => Registro de un nuevo usuario.
export const createUserController = async (req: Request, res: Response) => {
    const { name, email, birthdate, nDni, credentialsId } = req.body;
    
    try {
      const newUser: User = await createUserService({ name, email, birthdate, nDni, credentialsId });
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
export const getUsersController = async (req:Request,res:Response) => {
  try {
    const users : User[] = await getUsersService()
    res.status(200).json({users})
   } catch (error) {
    res.status(500).json({ message: "Error al traer los usuarios", error });
   }
}
//GET /users/:id => Obtener el detalle de un usuario específico.
export const getUserByIdController = async(req:Request,res:Response) => {
  try {
    const { id } = req.params;
    const user: User | null = await getUserByIdService(Number(id));
    res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({message:"Usuario inexistente",error})
    }
  }
export const deleteUserController= async (req:Request,res:Response) => {
  try {
    const { id } = req.body;
    await deleteUserService(id);
    res.status(200).json({message: "Usuario eliminado con éxito"})
  } catch (error) {
    res.status(500).json({message:"Error al borrar usuario",error})
  }
}

//POST /users/login => Login del usuario a la aplicación.
export const createLogin = async (req:Request,res:Response) => {
    res.status(200).json({message:"Login del usuario a la aplicación"});
}