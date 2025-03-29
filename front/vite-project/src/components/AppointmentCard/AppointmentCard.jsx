// Importamos React para poder crear el componente
import React from "react";
// Importamos el archivo de estilos específicos usando CSS Modules
import styles from "./AppointmentCard.module.css";

/**
 * 📌 Componente que representa un único turno.
 * Recibe información del turno como props y la muestra en una tarjeta.
 *
 * @param {Object} props - Propiedades que recibe el componente.
 * @param {number} props.id - Identificador único del turno.
 * @param {Date|string} props.date - Fecha del turno (puede ser un string o un objeto Date).
 * @param {string} props.time - Hora del turno (formato HH:MM).
 * @param {number} props.userId - ID del usuario que pidió el turno.
 * @param {"active"|"cancelled"} props.status - Estado del turno ("active" o "cancelled").
 * @returns {JSX.Element} Un elemento JSX que representa la tarjeta del turno.
 */
const AppointmentCard = ({ id, date, time, userId, status }) => {
  return (
    // 📌 Contenedor principal de la tarjeta del turno
    <div className={styles.card}>
      {/* Mostramos el ID del turno */}
      <p>
        <strong>ID:</strong> {id}
      </p>

      {/* Mostramos la fecha del turno, asegurándonos de que se vea en formato legible */}
      <p>
        <strong>Fecha:</strong> {new Date(date).toLocaleDateString()}
      </p>

      {/* Mostramos la hora del turno */}
      <p>
        <strong>Hora:</strong> {time}
      </p>

      {/* Mostramos el ID del usuario que reservó el turno */}
      <p>
        <strong>Usuario ID:</strong> {userId}
      </p>

      {/* Mostramos el estado del turno (activo o cancelado) */}
      <p>
        <strong>Estado:</strong> {status}
      </p>
    </div>
  );
};

// Exportamos el componente para que pueda ser usado en otros archivos
export default AppointmentCard;
