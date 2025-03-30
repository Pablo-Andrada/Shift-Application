// Importamos nodemailer, la librería que nos permite enviar correos desde Node.js
import nodemailer from "nodemailer";
// Importamos las variables de entorno necesarias: EMAIL_USER, EMAIL_PASSWORD y RECEIVER_EMAIL
import { EMAIL_USER, EMAIL_PASSWORD, RECEIVER_EMAIL } from "../config/envs";

// Configuramos el transportador (transporter) que se encargará de enviar los correos.
// En este caso, usamos Gmail como servicio. El transportador utiliza la cuenta configurada en las variables de entorno.
const transporter = nodemailer.createTransport({
  service: "Gmail", // Usamos el servicio de Gmail
  auth: {
    user: EMAIL_USER,         // Correo electrónico desde el cual se enviarán los mensajes
    pass: EMAIL_PASSWORD,     // Contraseña o contraseña de aplicación para acceder a la cuenta
  },
});

// Definimos una interfaz ContactData para tipar los datos que se enviarán en el correo.
// Esto ayuda a garantizar que se pasen correctamente los campos necesarios.
interface ContactData {
  name: string;   // Nombre del remitente
  email: string;  // Correo del remitente
  message: string; // Mensaje enviado
}

/**
 * Envía un correo con los datos del formulario de contacto.
 *
 * Esta función recibe un objeto con la información del contacto y construye el correo
 * que se enviará a la dirección configurada en RECEIVER_EMAIL.
 *
 * @param {ContactData} contactData - Objeto que contiene los datos del formulario: name, email y message.
 * @returns {Promise} Una promesa que se resuelve cuando el correo es enviado exitosamente o se rechaza en caso de error.
 */
export async function sendContactEmail({ name, email, message }: ContactData) {
  // Se construye el objeto mailOptions que define el contenido y configuración del correo.
  // Incluye: remitente, destinatario, asunto y cuerpo del mensaje.
  const mailOptions = {
    from: `"Contacto desde Turnero Taller Mecánica Avanzada (Shift-Application)" <${EMAIL_USER}>`, // Remitente (con un nombre descriptivo)
    to: RECEIVER_EMAIL, // Destinatario: la casilla que recibirá el correo
    subject: "Nuevo mensaje de contacto", // Asunto del mensaje
    text: `Has recibido un nuevo mensaje desde el formulario de contacto de Taller Mecánica Avanzada:\n\n` +
          `Nombre: ${name}\n` +
          `Email: ${email}\n\n` +
          `Mensaje:\n${message}`, // Cuerpo del mensaje en formato texto
  };

  // Se envía el correo utilizando el transportador configurado.
  // La función transporter.sendMail(mailOptions) retorna una promesa que se resuelve cuando el correo se envía exitosamente.
  return transporter.sendMail(mailOptions);
}
