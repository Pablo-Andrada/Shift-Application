// src/views/Mis Turnos/MisTurnos.jsx
import React, { useEffect, useState } from "react";
import styles from "./MisTurnos.module.css";
import useUserContext from "../../hooks/useUserContext";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";

/**
 * Función auxiliar para construir un string ISO que incluya fecha y hora,
 * evitando que el turno quede desfasado por la zona horaria.
 *
 * @param {string} dateStr - Fecha en formato "YYYY-MM-DD" del input type="date".
 * @param {string} timeStr - Hora en formato "HH:MM" del input type="time".
 * @returns {string} Una cadena en formato ISO que el backend interpretará correctamente.
 */
const buildISODateTime = (dateStr, timeStr) => {
  // Creamos un objeto Date a partir de la combinación
  const dateObj = new Date(`${dateStr}T${timeStr}:00`);
  // Ajustamos (restamos) el timezoneOffset para que el backend reciba la fecha "real"
  const localTime = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
  // Retornamos en formato ISO
  return localTime.toISOString();
};

/**
 * Componente MisTurnos
 * Muestra y crea los turnos asociados al usuario logueado.
 */
const MisTurnos = () => {
  const { user } = useUserContext();

  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("todos");

  // Estados para controlar el modal de creación de turno
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  /**
   * useEffect:
   * Carga la lista de turnos del usuario.
   */
  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/appointments/user/${user.id}`);
        if (!response.ok) {
          throw new Error("No se pudieron obtener los turnos.");
        }
        const data = await response.json();
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  /**
   * handleFilterChange:
   * Actualiza el estado de filtro (todos, activos, cancelados).
   */
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  /**
   * filteredAppointments:
   * Aplica el filtro sobre appointments (según estado).
   */
  const filteredAppointments =
    filterStatus === "todos"
      ? appointments
      : appointments.filter((appt) => appt.status === filterStatus);

  /**
   * handleCancel:
   * Cancela un turno (PUT /appointments/cancel/:id) y actualiza el estado local.
   */
  const handleCancel = async (id) => {
    const confirmAction = window.confirm("¿Estás seguro que querés cancelar este turno?");
    if (!confirmAction) return;

    try {
      const response = await fetch(`http://localhost:3000/appointments/cancel/${id}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("No se pudo cancelar el turno.");
      }
      // Actualizamos localmente el estado a "cancelled"
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "cancelled" } : appt))
      );
    } catch (err) {
      console.error("Error al cancelar turno:", err.message);
      setError(err.message);
    }
  };

  /**
   * handleCreateAppointment:
   * Envía el nuevo turno al backend (POST /appointments/schedule)
   * construyendo una fecha-hora ISO para evitar desfasajes.
   */
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      // Construimos la fecha-hora ISO a partir de newDate + newTime
      const isoDateTime = buildISODateTime(newDate, newTime);

      const response = await fetch("http://localhost:3000/appointments/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: isoDateTime, // Enviamos la cadena ISO
          time: newTime,     // Dejamos la cadena "HH:MM" + "AM/PM" si fuese el caso
          userId: user.id,
        }),
      });
      if (!response.ok) {
        throw new Error("No se pudo crear el turno.");
      }
      // Obtenemos el turno recién creado
      const newAppointment = await response.json();
      // Agregamos el turno a la lista
      setAppointments((prev) => [...prev, newAppointment]);

      // Cerramos el modal y limpiamos los campos
      setIsModalOpen(false);
      setNewDate("");
      setNewTime("");
    } catch (err) {
      console.error("Error al crear turno:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Turnos</h2>

      {/* Controles: filtro + botón para crear nuevo turno */}
      <div className={styles.filterContainer}>
        <label htmlFor="statusFilter" className={styles.filterLabel}>
          Filtrar por estado:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={handleFilterChange}
          className={styles.select}
        >
          <option value="todos">Todos</option>
          <option value="active">Activos</option>
          <option value="cancelled">Cancelados</option>
        </select>

        {/* Botón para abrir el modal de nuevo turno */}
        <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
          + Nuevo Turno
        </button>
      </div>

      {loading && <p className={styles.loading}>Cargando turnos...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* Renderizamos la lista de turnos filtrados */}
      {!loading && !error && filteredAppointments.length > 0 ? (
        <ul className={styles.appointmentList}>
          {filteredAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              id={appt.id}
              date={appt.date}
              time={appt.time}
              userId={appt.userId}
              status={appt.status}
              onCancel={handleCancel}
            />
          ))}
        </ul>
      ) : (
        !loading &&
        !error && <p className={styles.noAppointments}>No hay turnos que coincidan con el filtro seleccionado.</p>
      )}

      {/* Modal para crear nuevo turno */}
      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Nuevo Turno</h3>
            <form onSubmit={handleCreateAppointment} className={styles.form}>
              <label>
                Fecha:
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </label>
              <label>
                Hora:
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
              </label>
              <div className={styles.modalActions}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisTurnos;
