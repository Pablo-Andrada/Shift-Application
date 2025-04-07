// src/components/AppointmentCard/AppointmentCard.jsx
import React from "react";
import styles from "./AppointmentCard.module.css";

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
 * @param {function} props.onCancel - Función a ejecutar para cancelar el turno.
 * @returns {JSX.Element} Un elemento JSX que representa la tarjeta del turno.
 */
const AppointmentCard = ({ id, date, time, userId, status, onCancel }) => {
  return (
    <div className={styles.card}>
      <p>
        <strong>ID:</strong> {id}
      </p>
      <p>
        <strong>Fecha:</strong> {new Date(date).toLocaleDateString()}
      </p>
      <p>
        <strong>Hora:</strong> {time}
      </p>
      <p>
        <strong>Usuario ID:</strong> {userId}
      </p>
      <p className={`${styles.state} ${status === "active" ? styles.active : styles.cancelled}`}>
        <strong>Estado:</strong> {status}
      </p>
      {/* Botón para cancelar turno, se deshabilita si el turno ya está cancelado */}
      <button 
        className={styles.cancelButton} 
        disabled={status === "cancelled"}
        onClick={() => onCancel(id)} // Llamamos a la función onCancel pasada desde MisTurnos
      >
        Cancelar turno
      </button>
    </div>
  );
};

export default AppointmentCard;
