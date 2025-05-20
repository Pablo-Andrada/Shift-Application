// // src/components/CreateAppointment/CreateAppointment.jsx
// import React, { useState } from "react";
// import styles from "./CreateAppointment.module.css";
// import useUserContext from "../../hooks/useUserContext";

// /**
//  * Componente CreateAppointment
//  * Muestra un formulario en un modal para que el usuario logueado cree un nuevo turno.
//  * El formulario envía al backend los siguientes datos:
//  *   - userId: obtenido del contexto (del usuario logueado)
//  *   - date: la fecha seleccionada, convertida a formato ISO
//  *   - time: la hora seleccionada, formateada a formato 12 horas (AM/PM)
//  *   - status: se establece por defecto en "active"
//  *
//  * Si la creación es exitosa, se ejecuta onSuccess para actualizar la UI y se cierra el modal mediante onClose.
//  *
//  * @param {function} onClose - Función para cerrar el modal.
//  * @param {function} onSuccess - Función para actualizar la lista de turnos en el componente padre.
//  */
// const CreateAppointment = ({ onClose, onSuccess }) => {
//   const { user } = useUserContext();
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   /**
//    * buildDateTime:
//    * Combina la fecha y la hora seleccionadas y las convierte en un string en formato ISO.
//    * @param {string} date - La fecha en formato "YYYY-MM-DD".
//    * @param {string} time - La hora en formato "HH:MM" (24 horas).
//    * @returns {string} La fecha y hora combinadas en formato ISO.
//    */
//   const buildDateTime = (date, time) => {
//     const dateObj = new Date(`${date}T${time}`);
//     return dateObj.toISOString(); // Ej: "2025-04-01T10:00:00.000Z"
//   };

//   /**
//    * formatTimeDisplay:
//    * Convierte la hora en formato 24 horas ("HH:MM") a un formato 12 horas con AM/PM.
//    * Ejemplo: "13:30" se convierte en "1:30 PM".
//    * @param {string} timeStr - La hora en formato "HH:MM".
//    * @returns {string} La hora formateada.
//    */
//   const formatTimeDisplay = (timeStr) => {
//     const [hour, minute] = timeStr.split(":");
//     const hourInt = parseInt(hour, 10);
//     const suffix = hourInt >= 12 ? "PM" : "AM";
//     const hourFormatted = ((hourInt + 11) % 12) + 1;
//     return `${hourFormatted}:${minute} ${suffix}`;
//   };

//   /**
//    * handleSubmit:
//    * Envía una petición POST al backend para crear un nuevo turno.
//    * No se envía el id, ya que éste lo genera el backend.
//    * Se envían: userId (del contexto), date (formateada a ISO), time (formateada a 12h) y status ("active").
//    * Si la creación es exitosa, se ejecuta onSuccess para actualizar la lista de turnos en el componente padre
//    * y se cierra el modal mediante onClose.
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     try {
//       // Construimos el objeto a enviar al backend
//       const appointmentData = {
//         date: buildDateTime(date, time),          // Fecha y hora en formato ISO
//         time: formatTimeDisplay(time),            // Hora en formato 12h (ej: "11:00 AM")
//         userId: user.id,                          // ID del usuario logueado
//         status: "active",                         // Estado inicial del turno
//       };

//       // Realizamos la petición POST al endpoint de creación de turnos
//       const response = await fetch("http://localhost:3000/appointments/schedule", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(appointmentData),
//       });

//       if (!response.ok) {
//         throw new Error("No se pudo crear el turno.");
//       }

//       const data = await response.json();
//       // Llamamos a onSuccess para actualizar la lista de turnos en el componente padre
//       onSuccess(data);
//       // Cerramos el modal mediante onClose
//       onClose();
//     } catch (err) {
//       console.error("Error al crear turno:", err);
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <h3>Crear Nuevo Turno</h3>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <div className={styles.formGroup}>
//             <label>Fecha:</label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Hora:</label>
//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               required
//             />
//           </div>

//           {error && <p className={styles.error}>{error}</p>}

//           <div className={styles.buttonContainer}>
//             <button type="button" onClick={onClose} disabled={submitting} className={styles.cancelButton}>
//               Cancelar
//             </button>
//             <button type="submit" disabled={submitting} className={styles.saveButton}>
//               {submitting ? "Guardando..." : "Crear"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAppointment;
// src/components/CreateAppointment/CreateAppointment.jsx
import React, { useState } from "react";
import styles from "./CreateAppointment.module.css";
import useUserContext from "../../hooks/useUserContext";

const API = import.meta.env.VITE_API_URL;

/**
 * Componente CreateAppointment
 * Muestra un formulario en un modal para que el usuario logueado cree un nuevo turno.
 * El formulario envía al backend los siguientes datos:
 *   - userId: obtenido del contexto (del usuario logueado)
 *   - date: la fecha seleccionada, convertida a formato ISO
 *   - time: la hora seleccionada, formateada a formato 12 horas (AM/PM)
 *   - status: se establece por defecto en "active"
 *   - comentarios: (nuevo) texto opcional (máximo 50 caracteres) para comentarios adicionales del turno.
 *
 * Si la creación es exitosa, se ejecuta onSuccess para actualizar la lista de turnos en el componente padre
 * y se cierra el modal mediante onClose.
 *
 * @param {function} onClose - Función para cerrar el modal.
 * @param {function} onSuccess - Función para actualizar la lista de turnos en el componente padre.
 */
const CreateAppointment = ({ onClose, onSuccess }) => {
  const { user } = useUserContext();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comentarios, setComentarios] = useState(""); // Nuevo estado para comentarios
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * buildDateTime:
   * Combina la fecha y la hora seleccionadas y las convierte en un string en formato ISO.
   * @param {string} date - La fecha en formato "YYYY-MM-DD".
   * @param {string} time - La hora en formato "HH:MM" (24 horas).
   * @returns {string} La fecha y hora combinadas en formato ISO.
   */
  const buildDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toISOString(); // Ej: "2025-04-01T10:00:00.000Z"
  };

  /**
   * formatTimeDisplay:
   * Convierte la hora en formato 24 horas ("HH:MM") a un formato 12 horas con AM/PM.
   * Ejemplo: "13:30" se convierte en "1:30 PM".
   * @param {string} timeStr - La hora en formato "HH:MM".
   * @returns {string} La hora formateada.
   */
  const formatTimeDisplay = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const hourInt = parseInt(hour, 10);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hourFormatted = ((hourInt + 11) % 12) + 1;
    return `${hourFormatted}:${minute} ${suffix}`;
  };

  /**
   * handleSubmit:
   * Envía una petición POST al backend para crear un nuevo turno.
   * Se envían: userId, date (formateada a ISO), time (formateada a 12h), status ("active")
   * y comentarios (nuevo).
   * Si la creación es exitosa, se ejecuta onSuccess para actualizar la lista de turnos en el componente padre
   * y se cierra el modal mediante onClose.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Construimos el objeto a enviar al backend, incluyendo el nuevo campo "comentarios"
      const appointmentData = {
        date: buildDateTime(date, time),          // Fecha y hora en formato ISO
        time: formatTimeDisplay(time),            // Hora en formato 12h (ej: "11:00 AM")
        userId: user.id,                          // ID del usuario logueado
        status: "active",                         // Estado inicial del turno
        comentarios,                              // Comentarios opcionales (máx 50 caracteres)
      };

      // Realizamos la petición POST al endpoint de creación de turnos
      const response = await fetch(`${API}/appointments/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el turno.");
      }

      const data = await response.json();
      onSuccess(data); // Actualizamos la lista de turnos en el componente padre
      onClose();       // Cerramos el modal
    } catch (err) {
      console.error("Error al crear turno:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Crear Nuevo Turno</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Fecha:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hora:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          {/* Nuevo campo para comentarios */}
          <div className={styles.formGroup}>
            <label>Comentarios (máx 50 caracteres):</label>
            <input
              type="text"
              maxLength="50"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Escribe un comentario (opcional)"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={styles.saveButton}
            >
              {submitting ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
