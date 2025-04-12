// emailService.ts

// Importamos nodemailer, la librería que nos permite enviar correos desde Node.js
import nodemailer from "nodemailer";
// Importamos las variables de entorno necesarias: EMAIL_USER, EMAIL_PASSWORD y RECEIVER_EMAIL
import { EMAIL_USER, EMAIL_PASSWORD, RECEIVER_EMAIL } from "../config/envs";

/**
 * Configuración del transportador.
 * Se utiliza Gmail como servicio de correo; el transportador usa las credenciales definidas en las variables de entorno.
 */
const transporter = nodemailer.createTransport({
  service: "Gmail", // Usamos el servicio de Gmail
  auth: {
    user: EMAIL_USER,      // Correo electrónico desde el cual se enviarán los mensajes
    pass: EMAIL_PASSWORD,  // Contraseña o contraseña de aplicación para acceder a la cuenta
  },
});

/**
 * INTERFAZ: ContactData
 * Tipado para los datos del formulario de contacto.
 */
interface ContactData {
  name: string;    // Nombre del remitente
  email: string;   // Correo del remitente
  message: string; // Mensaje enviado
}

/**
 * INTERFAZ: AppointmentData
 * Tipado para los datos del turno para confirmación.
 */
interface AppointmentData {
  appointmentId: number; // ID generado para el turno
  date: string;          // Fecha del turno (en formato ISO)
  time: string;          // Hora del turno (por ejemplo, "10:00 AM")
  userName: string;      // Nombre del usuario (para personalizar el correo)
  userEmail: string;     // Email del usuario (destinatario del correo)
  comentarios?: string;  // (Opcional) Comentarios adicionales, máximo 50 caracteres
}

/**
 * INTERFAZ: AppointmentCancellationData
 * Tipado para los datos del turno cancelado.
 */
interface AppointmentCancellationData {
  appointmentId: number; // ID del turno cancelado
  date: string;          // Fecha del turno (en formato ISO)
  time: string;          // Hora del turno (por ejemplo, "10:00 AM")
  userName: string;      // Nombre del usuario
  userEmail: string;     // Email del usuario (destinatario del correo)
}

/**
 * INTERFAZ: AppointmentReminderData
 * Tipado para los datos del turno para recordatorio.
 */
interface AppointmentReminderData {
  appointmentId: number; // ID del turno
  date: string;          // Fecha del turno (en formato ISO)
  time: string;          // Hora del turno (por ejemplo, "10:00 AM")
  userName: string;      // Nombre del usuario
  userEmail: string;     // Email del usuario (destinatario del correo)
  comentarios?: string;  // (Opcional) Comentarios adicionales
}

/**
 * Template HTML Base
 * Devuelve una estructura HTML base para los correos con header y footer.
 *
 * @param {string} title - Título principal del correo.
 * @param {string} content - Contenido HTML personalizado (detalle del mensaje).
 * @returns {string} HTML completo para el correo.
 */
const buildHtmlTemplate = (title: string, content: string): string => {
  // URL del logotipo, reemplaza por tu URL real o Base64.
  const logoURL = "https://cdn.niviweb.com/images/coches/logo-taller-1.png";
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden;">
        <!-- Header con logotipo -->
        <div style="background-color: #ccc; padding: 10px; text-align: center;">
          <img src="${logoURL}" alt="Logo" style="max-width: 100px;" />
        </div>
        <!-- Contenido -->
        <div style="padding: 20px;">
          <h2 style="color: #333;">${title}</h2>
          ${content}
        </div>
        <!-- Footer -->
        <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          &copy; ${new Date().getFullYear()} Taller Mecánica Avanzada. Todos los derechos reservados.
        </div>
      </div>
    </div>
  `;
};

/**
 * sendContactEmail
 * Envía un correo con los datos del formulario de contacto.
 *
 * @param {ContactData} contactData - Objeto que contiene el nombre, email y mensaje.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía correctamente o se rechaza en caso de error.
 */
export async function sendContactEmail({ name, email, message }: ContactData) {
  // Construimos el contenido HTML del correo de contacto
  const content = `
    <p style="font-size: 16px; color: #555;">Has recibido un nuevo mensaje desde el formulario de contacto:</p>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mensaje:</strong><br/> ${message}</p>
  `;
  const htmlContent = buildHtmlTemplate("Nuevo Mensaje de Contacto", content);

  // Opciones del correo
  const mailOptions = {
    from: `"Contacto desde Turnero Taller Mecánica Avanzada (Shift-Application)" <${EMAIL_USER}>`,
    to: RECEIVER_EMAIL,
    subject: "Nuevo mensaje de contacto",
    text: `Has recibido un nuevo mensaje:\n\nNombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * sendAppointmentConfirmationEmail
 * Envía un correo de confirmación al usuario cuando se crea un nuevo turno.
 *
 * @param {AppointmentData} appointment - Objeto que contiene los datos del turno y del usuario.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía o se rechaza en caso de error.
 */
export async function sendAppointmentConfirmationEmail(appointment: AppointmentData) {
  // Contenido HTML para el correo de confirmación
  const content = `
    <p style="font-size: 16px; color: #555;">Hola ${appointment.userName},</p>
    <p style="font-size: 16px; color: #555;">Tu turno ha sido reservado exitosamente.</p>
    <h3 style="color: #333;">Detalles del turno:</h3>
    <table style="width: 100%; font-size: 16px; color: #555; margin-bottom: 20px;">
      <tr>
        <td style="width: 40px; vertical-align: middle;">
          <img src="https://img.icons8.com/ios-filled/50/000000/calendar.png" alt="Fecha" style="width: 24px;" />
        </td>
        <td style="vertical-align: middle;">Fecha: ${new Date(appointment.date).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="width: 40px; vertical-align: middle;">
          <img src="https://img.icons8.com/ios-filled/50/000000/clock.png" alt="Hora" style="width: 24px;" />
        </td>
        <td style="vertical-align: middle;">Hora: ${appointment.time}</td>
      </tr>
      <tr>
        <td style="width: 40px; vertical-align: middle;">
          <img src="https://img.icons8.com/ios-filled/50/000000/comments.png" alt="Comentarios" style="width: 24px;" />
        </td>
        <td style="vertical-align: middle;">Comentarios: ${appointment.comentarios ? appointment.comentarios : "N/A"}</td>
      </tr>
    </table>
    <p style="font-size: 16px; color: #555;">Gracias por confiar en nosotros.</p>
    <p style="font-size: 16px; color: #555;">Atentamente,<br/>Taller Mecánica Avanzada</p>
  `;
  const htmlContent = buildHtmlTemplate(`Confirmación de turno #${appointment.appointmentId}`, content);

  const mailOptions = {
    from: `"Turno Confirmado - Taller Mecánica Avanzada" <${EMAIL_USER}>`,
    to: appointment.userEmail,
    subject: `Confirmación de turno #${appointment.appointmentId}`,
    text:
      `Hola ${appointment.userName},\n\n` +
      `Tu turno ha sido reservado exitosamente.\n\n` +
      `Detalles del turno:\n` +
      `Fecha: ${new Date(appointment.date).toLocaleDateString()}\n` +
      `Hora: ${appointment.time}\n` +
      `Comentarios: ${appointment.comentarios ? appointment.comentarios : "N/A"}\n\n` +
      `Gracias por confiar en nosotros.\n\n` +
      `Atentamente,\n` +
      `Taller Mecánica Avanzada`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * sendAppointmentCancellationEmail
 * Envía un correo de confirmación al usuario cuando se cancela un turno.
 *
 * @param {AppointmentCancellationData} appointment - Objeto que contiene los datos del turno y del usuario.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía o se rechaza en caso de error.
 */
export async function sendAppointmentCancellationEmail(appointment: AppointmentCancellationData) {
  const content = `
    <p style="font-size: 16px; color: #555;">Hola ${appointment.userName},</p>
    <p style="font-size: 16px; color: #555;">Te confirmamos que tu turno programado para el ${new Date(appointment.date).toLocaleDateString()} a las ${appointment.time} ha sido cancelado exitosamente.</p>
    <p style="font-size: 16px; color: #555;">Si deseas reprogramarlo, visita nuestra aplicación.</p>
    <p style="font-size: 16px; color: #555;">Atentamente,<br/>Taller Mecánica Avanzada</p>
  `;
  const htmlContent = buildHtmlTemplate(`Cancelación de turno #${appointment.appointmentId}`, content);

  const mailOptions = {
    from: `"Turno Cancelado - Taller Mecánica Avanzada" <${EMAIL_USER}>`,
    to: appointment.userEmail,
    subject: `Cancelación de turno #${appointment.appointmentId}`,
    text:
      `Hola ${appointment.userName},\n\n` +
      `Te confirmamos que tu turno programado para el ${new Date(appointment.date).toLocaleDateString()} a las ${appointment.time} ha sido cancelado exitosamente.\n\n` +
      `Si deseas reprogramarlo, visita nuestra aplicación.\n\n` +
      `Atentamente,\n` +
      `Taller Mecánica Avanzada`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * sendAppointmentReminderEmail
 * Envía un correo recordatorio al usuario un día antes de su turno.
 *
 * Se construye un correo recordatorio que incluye los detalles del turno y
 * se envía al correo del usuario para recordarle que tiene un turno programado para mañana.
 *
 * @param {AppointmentReminderData} appointment - Objeto que contiene los datos del turno y del usuario.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía o se rechaza en caso de error.
 */
export async function sendAppointmentReminderEmail(appointment: AppointmentReminderData) {
  const content = `
    <p style="font-size: 16px; color: #555;">Hola ${appointment.userName},</p>
    <p style="font-size: 16px; color: #555;">Este es un recordatorio de que tienes un turno programado para mañana.</p>
    <h3 style="color: #333;">Detalles del turno:</h3>
    <table style="width: 100%; font-size: 16px; color: #555; margin-bottom: 20px;">
      <tr>
        <td style="width: 40px; vertical-align: middle;">
          <img src="https://img.icons8.com/ios-filled/50/000000/calendar.png" alt="Fecha" style="width: 24px;" />
        </td>
        <td style="vertical-align: middle;">Fecha: ${new Date(appointment.date).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="width: 40px; vertical-align: middle;">
          <img src="https://img.icons8.com/ios-filled/50/000000/clock.png" alt="Hora" style="width: 24px;" />
        </td>
        <td style="vertical-align: middle;">Hora: ${appointment.time}</td>
      </tr>
      <tr>
        <td style="width: 40px; vertical-align: middle;">
          <img src="https://img.icons8.com/ios-filled/50/000000/comments.png" alt="Comentarios" style="width: 24px;" />
        </td>
        <td style="vertical-align: middle;">Comentarios: ${appointment.comentarios ? appointment.comentarios : "N/A"}</td>
      </tr>
    </table>
    <p style="font-size: 16px; color: #555;">Por favor, asegúrate de estar disponible.</p>
    <p style="font-size: 16px; color: #555;">Gracias por confiar en nosotros.</p>
    <p style="font-size: 16px; color: #555;">Atentamente,<br/>Taller Mecánica Avanzada</p>
  `;
  const htmlContent = buildHtmlTemplate(`Recordatorio: Tu turno #${appointment.appointmentId} es mañana`, content);

  const mailOptions = {
    from: `"Recordatorio de turno - Taller Mecánica Avanzada" <${EMAIL_USER}>`,
    to: appointment.userEmail,
    subject: `Recordatorio: Tu turno #${appointment.appointmentId} es mañana`,
    text:
      `Hola ${appointment.userName},\n\n` +
      `Este es un recordatorio de que tienes un turno programado para mañana.\n\n` +
      `Detalles del turno:\n` +
      `Fecha: ${new Date(appointment.date).toLocaleDateString()}\n` +
      `Hora: ${appointment.time}\n` +
      `Comentarios: ${appointment.comentarios ? appointment.comentarios : "N/A"}\n\n` +
      `Por favor, asegúrate de estar disponible.\n\n` +
      `Gracias por confiar en nosotros.\n\n` +
      `Atentamente,\n` +
      `Taller Mecánica Avanzada`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}
