import { Request, Response } from "express";
import { sendContactEmail } from "../services/emailService";

export const handleContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        // Usa el servicio de email
        await sendContactEmail({ name, email, message });

        res.status(200).json({ message: "Mensaje enviado correctamente" });
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ error: "Hubo un error al enviar el mensaje" });
    }
};
