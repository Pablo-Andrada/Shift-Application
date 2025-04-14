import React from "react";
import styles from "./AppointmentCard.module.css";

/**
 * Función que ajusta la fecha recibida (en formato ISO o como objeto Date)
 * sumándole el desfase de la zona horaria, de modo que se muestre correctamente en la zona local.
 *
 * @param {string | Date} dateInput - La fecha en formato ISO o un objeto Date.
 * @returns {Date} La fecha ajustada a la hora local.
 */
const adjustDate = (dateInput) => {
  // Si 'dateInput' es una cadena, la convertimos a objeto Date
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  // Suma el desfase en milisegundos que el navegador aplica a la fecha (para ajustar a la zona local)
  const adjusted = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return adjusted;
};

/**
 * 📌 Componente que representa un único turno.
 * Recibe información del turno como props y la muestra en una tarjeta.
 *
 * @param {Object} props - Propiedades que recibe el componente.
 * @param {number} props.id - Identificador único del turno.
 * @param {Date|string} props.date - Fecha del turno.
 * @param {string} props.time - Hora del turno.
 * @param {number} props.userId - ID del usuario que pidió el turno.
 * @param {"active"|"cancelled"} props.status - Estado del turno.
 * @param {string} [props.comentarios] - (Opcional) Comentarios del turno (máx 50 caracteres).
 * @param {function} props.onCancel - Función a ejecutar para cancelar el turno.
 * @param {function} props.onDismiss - Función a ejecutar para descartar la tarjeta de la lista.
 * @returns {JSX.Element} Un elemento JSX que representa la tarjeta del turno.
 */
const AppointmentCard = ({
  id,
  date,
  time,
  userId,
  status,
  comentarios,
  onCancel,
  onDismiss,
}) => {
  return (
    <div className={styles.card}>
      {/* Botón "x" para descartar la tarjeta. Se posiciona en la esquina superior derecha */}
      <div
        className={styles.closeButton}
        onClick={() => onDismiss && onDismiss(id)}
      >
        x
      </div>

      <p>
        <strong>ID:</strong> {id}
      </p>
      <p>
        <strong>Fecha:</strong> {adjustDate(date).toLocaleDateString()}
      </p>
      <p>
        <strong>Hora:</strong> {time}
      </p>
      <p>
        <strong>Usuario ID:</strong> {userId}
      </p>
      <p
        className={`${styles.state} ${
          status === "active" ? styles.active : styles.cancelled
        }`}
      >
        <strong>Estado:</strong> {status}
      </p>

      {/* 
        NUEVA SECCIÓN: Comentarios 
        Se muestra con un espacio fijo para que todas las tarjetas con o sin comentarios 
        luzcan uniformes.
      */}
      <div className={styles.comments}>
        <strong>Comentarios:</strong>{" "}
        {comentarios ? comentarios : "-"} {/* Si no hay comentarios, mostramos un guión */}
      </div>

      {/* 
        Botón para cancelar turno: se deshabilita si el turno ya está cancelado 
        Al hacer clic, llamamos a onCancel(id) que viene desde MisTurnos.jsx
      */}
      <button
        className={styles.cancelButton}
        disabled={status === "cancelled"}
        onClick={() => onCancel(id)}
      >
        Cancelar turno
      </button>
    </div>
  );
};

export default AppointmentCard;
