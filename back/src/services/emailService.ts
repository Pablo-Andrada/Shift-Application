// src/services/emailService.ts

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
 * sendContactEmail
 * Envía un correo con los datos del formulario de contacto.
 *
 * @param {ContactData} contactData - Objeto que contiene el nombre, email y mensaje.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía correctamente o se rechaza en caso de error.
 */
export async function sendContactEmail({ name, email, message }: ContactData) {
  // Definimos las opciones del correo
  const mailOptions = {
    from: `"Contacto desde Turnero Taller Mecánica Avanzada (Shift-Application)" <${EMAIL_USER}>`,
    to: RECEIVER_EMAIL,
    subject: "Nuevo mensaje de contacto",
    text:
      `Has recibido un nuevo mensaje desde el formulario de contacto de Taller Mecánica Avanzada:\n\n` +
      `Nombre: ${name}\n` +
      `Email: ${email}\n\n` +
      `Mensaje:\n${message}`,
  };

  // Enviamos el correo y retornamos la promesa
  return transporter.sendMail(mailOptions);
}

/**
 * INTERFAZ: AppointmentData
 * Tipado para los datos del turno que se usarán para enviar el correo de confirmación.
 */
interface AppointmentData {
  appointmentId: number; // ID generado para el turno
  date: string;          // Fecha del turno (en formato ISO)
  time: string;          // Hora del turno (por ejemplo, "10:00 AM")
  userName: string;      // Nombre del usuario, para personalizar el correo
  userEmail: string;     // Email del usuario (destinatario del correo)
}

/**
 * sendAppointmentConfirmationEmail
 * Envía un correo de confirmación al usuario cuando se crea un nuevo turno.
 *
 * Esta función construye un correo con los datos del turno (fecha, hora e ID) y
 * lo envía al correo del usuario para confirmar que el turno fue creado exitosamente.
 *
 * @param {AppointmentData} appointment - Objeto que contiene los datos del turno y del usuario.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía o se rechaza en caso de error.
 */
export async function sendAppointmentConfirmationEmail(appointment: AppointmentData) {
  // Definimos las opciones del correo de confirmación de turno
  const mailOptions = {
    from: `"Turno Confirmado - Taller Mecánica Avanzada" <${EMAIL_USER}>`,
    to: appointment.userEmail,
    subject: `Confirmación de turno #${appointment.appointmentId}`,
    text:
      `Hola ${appointment.userName},\n\n` +
      `Tu turno ha sido reservado exitosamente.\n\n` +
      `Detalles del turno:\n` +
      `Fecha: ${new Date(appointment.date).toLocaleDateString()}\n` +
      `Hora: ${appointment.time}\n\n` +
      `Gracias por confiar en nosotros.\n\n` +
      `Atentamente,\n` +
      `Taller Mecánica Avanzada`,
  };

  // Enviamos el correo utilizando el transportador configurado y retornamos la promesa
  return transporter.sendMail(mailOptions);
}

/**
 * INTERFAZ: AppointmentCancellationData
 * Tipado para los datos del turno cancelado que se usarán para enviar el correo de cancelación.
 */
interface AppointmentCancellationData {
  appointmentId: number; // ID del turno cancelado
  date: string;          // Fecha del turno (en formato ISO)
  time: string;          // Hora del turno (por ejemplo, "10:00 AM")
  userName: string;      // Nombre del usuario
  userEmail: string;     // Email del usuario (destinatario del correo)
}

/**
 * sendAppointmentCancellationEmail
 * Envía un correo de confirmación al usuario cuando se cancela un turno.
 *
 * Esta función construye un correo con los datos del turno cancelado y
 * lo envía al correo del usuario para confirmar que el turno ha sido cancelado.
 *
 * @param {AppointmentCancellationData} appointment - Objeto que contiene los datos del turno y del usuario.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía o se rechaza en caso de error.
 */
export async function sendAppointmentCancellationEmail(appointment: AppointmentCancellationData) {
  // Definimos las opciones del correo de cancelación
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
  };

  // Enviamos el correo utilizando el mismo transportador configurado y retornamos la promesa
  return transporter.sendMail(mailOptions);
}

/**
 * INTERFAZ: AppointmentReminderData
 * Tipado para los datos del turno que se usarán para enviar el correo de recordatorio.
 */
interface AppointmentReminderData {
  appointmentId: number; // ID del turno
  date: string;          // Fecha del turno (en formato ISO)
  time: string;          // Hora del turno (por ejemplo, "10:00 AM")
  userName: string;      // Nombre del usuario
  userEmail: string;     // Email del usuario (destinatario del correo)
}

/**
 * sendAppointmentReminderEmail
 * Envía un correo recordatorio al usuario un día antes de su turno.
 *
 * Esta función construye un correo recordatorio con los datos del turno (fecha, hora e ID) y
 * lo envía al correo del usuario para recordarle que tiene un turno programado para mañana.
 *
 * @param {AppointmentReminderData} appointment - Objeto que contiene los datos del turno y del usuario.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía o se rechaza en caso de error.
 */
export async function sendAppointmentReminderEmail(appointment: AppointmentReminderData) {
  // Definimos las opciones del correo de recordatorio
  const mailOptions = {
    from: `"Recordatorio de turno - Taller Mecánica Avanzada" <${EMAIL_USER}>`,
    to: appointment.userEmail,
    subject: `Recordatorio: Tu turno #${appointment.appointmentId} es mañana`,
    text:
      `Hola ${appointment.userName},\n\n` +
      `Este es un recordatorio de que tienes un turno programado para mañana.\n\n` +
      `Detalles del turno:\n` +
      `Fecha: ${new Date(appointment.date).toLocaleDateString()}\n` +
      `Hora: ${appointment.time}\n\n` +
      `Por favor, asegúrate de estar disponible.\n\n` +
      `Gracias por confiar en nosotros.\n\n` +
      `Atentamente,\n` +
      `Taller Mecánica Avanzada`,
  };

  // Enviamos el correo utilizando el transportador y retornamos la promesa
  return transporter.sendMail(mailOptions);
}
