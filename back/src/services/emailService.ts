import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD, RECEIVER_EMAIL } from "../config/envs";

// Configura el transportador para enviar correos
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

interface ContactData {
  name: string;
  email: string;
  message: string;
}

/**
 * Envía un correo con los datos del formulario de contacto.
 * @param contactData - Datos del formulario.
 */
export async function sendContactEmail({ name, email, message }: ContactData) {
  const mailOptions = {
    from: `"Contacto desde Mi Turnero" <${EMAIL_USER}>`,
    to: RECEIVER_EMAIL,
    subject: "Nuevo mensaje de contacto",
    text: `Has recibido un nuevo mensaje desde el formulario de contacto:\n\n` +
          `Nombre: ${name}\n` +
          `Email: ${email}\n\n` +
          `Mensaje:\n${message}`,
  };

  return transporter.sendMail(mailOptions);
}
