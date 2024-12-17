import { Request, Response } from "express";

//GET /users => Obtener el listado de todos los usuarios.
export const getUsers = async (req:Request,res:Response) => {
    res.status(200).json({message:"listado de todos los usuarios"})
}
//GET /users/:id => Obtener el detalle de un usuario específico.
export const getUserId = async(req:Request,res:Response) => {
    res.status(200).json({message:"detalle de un usuario específico"})
}

//POST /users/register => Registro de un nuevo usuario.
export const createUser = async (req:Request,res:Response) => {
    res.status(200).json({message:"Registro de un nuevo usuario"});
}

//POST /users/login => Login del usuario a la aplicación.
export const createLogin = async (req:Request,res:Response) => {
    res.status(200).json({message:"Login del usuario a la aplicación"});
}