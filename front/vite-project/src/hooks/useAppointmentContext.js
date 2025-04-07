// src/hooks/useAppointmentContext.js
import { useContext } from "react";
import { AppointmentContext } from "../context/AppointmentContext";

// Hook personalizado para facilitar el uso del AppointmentContext
const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointmentContext debe usarse dentro de un AppointmentProvider");
  }
  return context;
};

export default useAppointmentContext;
