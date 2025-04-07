// src/context/AppointmentContext.jsx
import React, { createContext, useState } from "react";

// Creamos el contexto para los turnos (appointments)
export const AppointmentContext = createContext();

// El proveedor que envolverá a los componentes que necesiten acceder a los turnos
export const AppointmentProvider = ({ children }) => {
  // Estado para almacenar la lista de turnos del usuario
  const [appointments, setAppointments] = useState([]);

  // Función para actualizar la lista de turnos
  const updateAppointments = (newAppointments) => {
    setAppointments(newAppointments);
  };

  // Función para actualizar un turno individual (por ejemplo, al cancelar un turno)
  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === appointmentId ? { ...appt, status } : appt
      )
    );
  };

  // El value del contexto incluye el estado y las funciones para actualizarlo
  const value = {
    appointments,
    updateAppointments,
    updateAppointmentStatus,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
