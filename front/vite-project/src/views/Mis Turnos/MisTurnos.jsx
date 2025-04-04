// src/views/Turnos/Turnos.jsx
import React, { useState, useEffect } from "react";
// Importamos el componente que muestra cada turno individual
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
// Importamos axios para hacer la petición HTTP al backend
import axios from "axios";
// Importamos los estilos locales con CSS Modules
import styles from "./MisTurnos.module.css";

const MisTurnos = () => {
  // Inicializamos el estado 'appointments' como un arreglo vacío.
  // Esto se actualizará una vez se obtengan los datos del backend.
  const [appointments, setAppointments] = useState([]);

  // useEffect se ejecuta una vez al montar el componente
  useEffect(() => {
    // Hacemos una petición GET a la URL del backend para obtener TODOS los turnos
    axios
      .get("http://localhost:3000/appointments")
      .then((response) => {
        // Al resolverse la promesa, actualizamos el estado 'appointments'
        // con el arreglo de turnos recibido desde el backend.
        setAppointments(response.data);
      })
      .catch((error) => {
        // Si ocurre un error, se imprime en la consola para poder depurar.
        console.error("Error al cargar turnos:", error);
      });
  }, []); // El arreglo vacío indica que este efecto se ejecuta solo al montar el componente

  return (
    <div className={styles.container}>
      {/* Título de la vista */}
      <h1 className={styles.header}>Mis Turnos</h1>

      {/* Renderizado condicional:
            Si no hay turnos, muestra un mensaje;
            si hay turnos, mapea cada uno y renderiza un AppointmentCard. */}
      {appointments.length === 0 ? (
        <p>No hay turnos disponibles.</p>
      ) : (
        appointments.map((turno) => (
          <AppointmentCard
            key={turno.id} // Clave única para cada turno
            id={turno.id} // Identificador del turno
            date={turno.date} // Fecha del turno
            time={turno.time} // Hora del turno
            userId={turno.userId} // ID del usuario que solicitó el turno
            status={turno.status} // Estado del turno ("active" o "cancelled")
          />
        ))
      )}
    </div>
  );
};

export default MisTurnos;
