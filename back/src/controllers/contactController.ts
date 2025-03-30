import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD, RECEIVER_EMAIL } from "../config/envs";

export const handleContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: EMAIL_USER,
            to: RECEIVER_EMAIL,
            subject: `Nuevo mensaje de contacto de ${name}`,
            text: `Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Mensaje enviado correctamente" });
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ error: "Hubo un error al enviar el mensaje" });
    }
};
