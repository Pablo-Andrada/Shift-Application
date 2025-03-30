// src/services/emailService.js
import nodemailer from "nodemailer";

// Configura el transportador para enviar correos
const transporter = nodemailer.createTransport({
  service: "Gmail", // Puedes usar otros proveedores si lo prefieres
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Envía un correo con los datos del formulario de contacto.
 * @param {Object} contactData - Los datos del formulario.
 * @param {string} contactData.name - Nombre del remitente.
 * @param {string} contactData.email - Email del remitente.
 * @param {string} contactData.message - Mensaje enviado.
 * @returns {Promise} Promesa que se resuelve cuando el correo se envía.
 */
async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: `"Contacto desde Mi Turnero" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: "Nuevo mensaje de contacto",
    text: `Has recibido un nuevo mensaje desde el formulario de contacto:\n\n` +
          `Nombre: ${name}\n` +
          `Email: ${email}\n\n` +
          `Mensaje:\n${message}`,
  };

  // Envía el correo usando el transportador
  return transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail };
