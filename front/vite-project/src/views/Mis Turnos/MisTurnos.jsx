// src/views/Turnos/Turnos.jsx
import React, { useState } from "react";
// Importamos el componente AppointmentCard que representa un único turno
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
// Importamos el arreglo de turnos (simulado) desde el helper
import myAppointments from "../../helpers/myAppointments";
// Importamos los estilos locales con CSS Modules
import styles from "./MisTurnos.module.css";

const MisTurnos = () => {
  // Inicializamos el estado con el arreglo de turnos
  const [appointments] = useState(myAppointments);

  return (
    <div className={styles.container}>
      {/* Título de la vista */}
      <h1 className={styles.header}>Mis Turnos</h1>
      
      {/* Mapeamos cada turno del estado para renderizar un AppointmentCard */}
      {appointments.map((turno) => (
        <AppointmentCard
          key={turno.id}        // Clave única para cada elemento
          id={turno.id}         // Identificador del turno
          date={turno.date}     // Fecha del turno
          time={turno.time}     // Hora del turno
          userId={turno.userId} // ID del usuario que reservó el turno
          status={turno.status} // Estado del turno (active o cancelled)
        />
      ))}
    </div>
  );
};

export default MisTurnos;
