import { Request, Response } from "express";
import {
    createUserService,
    getUsersService,
    getUserByIdService,
    deleteUserService,
    getUserByCredentialIdService
} from "../services/userService";
import { createCredential } from "../services/credentialService";
import { CredentialModel } from "../config/data-source";
import { User } from "../entities/User";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "TALLER2025";

export const createUserController = async (req: Request, res: Response) => {
    const { name, email, birthdate, nDni, password, adminCode } = req.body;
    if (!password) return res.status(400).json({ message: "El campo 'password' es obligatorio." });

    try {
        const role = adminCode && adminCode === ADMIN_SECRET ? "admin" : "user";
        const credentialId = await createCredential(email, password);
        const newUser: User = await createUserService({ name, email, birthdate, nDni, credentialsId: credentialId, role });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el usuario", error });
    }
};

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getUsersService();
        res.status(200).json({ users });
    } catch (error) {
        res.status(404).json({ message: "Error al traer los usuarios", error });
    }
};

export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(Number(id));
        res.status(200).json({ user });
    } catch (error) {
        res.status(404).json({ message: "Usuario inexistente", error });
    }
};

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        await deleteUserService(id);
        res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(404).json({ message: "Error al borrar usuario", error });
    }
};

export const createLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Por favor complete todos los campos." });

        const credential = await CredentialModel.findOne({
            where: { username: email },
            order: { id: "DESC" }
        });

        if (!credential) return res.status(401).json({ message: "Credenciales inválidas." });
        if (credential.password !== password) return res.status(401).json({ message: "Credenciales inválidas." });

        const user = await getUserByCredentialIdService(credential.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

        return res.status(200).json({ message: "Login exitoso.", user });
    } catch (error) {
        return res.status(500).json({ message: "Error al iniciar sesión.", error });
    }
};
