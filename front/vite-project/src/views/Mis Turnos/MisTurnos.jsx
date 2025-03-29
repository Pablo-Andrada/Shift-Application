// src/views/MisTurnos/MisTurnos.jsx
import React, { useState } from "react";
// Importamos el arreglo de turnos desde el helper
import myAppointments from "../../helpers/myAppointments";
// Importamos el CSS Module específico para este componente
import styles from "./MisTurnos.module.css";


// Componente funcional MisTurnos
const MisTurnos = () => {
    // Inicializamos el estado con el arreglo de turnos importado
    // Creamos un estado llamado "appointments" y su función para actualizarlo "setAppointments"
  const [appointments, _setAppointments] = useState(myAppointments);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Este es el componente Mis Turnos</h1>
      
      {/* Recorremos el arreglo de turnos y renderizamos la información de cada uno */}
      {appointments.map((turno) => (
        <div key={turno.id} className={styles.appointmentCard}>
          <p>
            <strong>ID:</strong> {turno.id}
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(turno.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Hora:</strong> {turno.time}
          </p>
          <p>
            <strong>Usuario ID:</strong> {turno.userId}
          </p>
          <p>
            <strong>Estado:</strong> {turno.status}
          </p>
        </div>
      ))}
    </div>
  );
};


// Exportamos el componente para que pueda ser utilizado en otras partes de la aplicación
export default MisTurnos;
