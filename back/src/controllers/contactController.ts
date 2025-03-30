// Importamos Request y Response de Express para tipar los parámetros del controlador.
import { Request, Response } from "express";
// Importamos la función sendContactEmail del servicio de email, la cual se encargará de enviar el correo.
import { sendContactEmail } from "../services/emailService";

/**
 * Controlador para manejar el formulario de contacto.
 *
 * Esta función recibe la solicitud del frontend que contiene los datos del formulario de contacto.
 * Realiza una validación básica para asegurarse de que se han enviado todos los campos necesarios,
 * y luego llama al servicio de email para enviar el correo.
 *
 * Si los datos no son válidos, responde con un error 400.
 * Si el correo se envía exitosamente, responde con un mensaje de éxito (200).
 * En caso de error durante el envío, responde con un error 500.
 *
 * @param req - Objeto de solicitud (Request) que contiene el body con name, email y message.
 * @param res - Objeto de respuesta (Response) que se usará para enviar la respuesta al cliente.
 */
export const handleContactForm = async (req: Request, res: Response) => {
    try {
        // Extraemos los campos name, email y message del body de la solicitud
        const { name, email, message } = req.body;

        // Validamos que todos los campos requeridos estén presentes
        if (!name || !email || !message) {
            // Si falta algún campo, respondemos con un error 400 (Bad Request)
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        // Llamamos al servicio de email para enviar el correo con los datos del formulario.
        // La función sendContactEmail se encarga de configurar y enviar el correo usando nodemailer.
        await sendContactEmail({ name, email, message });

        // Si el correo se envía correctamente, respondemos con un mensaje de éxito y un status 200.
        res.status(200).json({ message: "Mensaje enviado correctamente" });
    } catch (error) {
        // En caso de error, lo mostramos en la consola y respondemos con un error 500 (Internal Server Error)
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ error: "Hubo un error al enviar el mensaje" });
    }
};
