// src/views/Mis Turnos/MisTurnos.jsx
import React, { useEffect, useState } from "react";
// Importamos los estilos locales
import styles from "./MisTurnos.module.css";
// Importamos el hook de contexto para acceder al usuario logueado
import useUserContext from "../../hooks/useUserContext";
// Importamos el componente AppointmentCard para mostrar cada turno
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";

/**
 * Componente MisTurnos
 * Muestra los turnos asociados al usuario logueado.
 * Si el usuario no está logueado, no se debe acceder a esta vista (está protegida en App.jsx).
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

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredAppointments =
    filterStatus === "todos"
      ? appointments
      : appointments.filter((appt) => appt.status === filterStatus);

  const handleCancel = async (id) => {
    const confirm = window.confirm("¿Estás seguro que querés cancelar este turno?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:3000/appointments/cancel/${id}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("No se pudo cancelar el turno.");
      }

      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (err) {
      console.error("Error al cancelar turno:", err.message);
      setError(err.message);
    }
  };

  /**
   * handleCreateAppointment:
   * Envía el nuevo turno al backend y actualiza la lista de turnos si todo sale bien.
   */
  const handleCreateAppointment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/appointments/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: newDate,
          time: newTime,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el turno.");
      }

      const newAppointment = await response.json();
      setAppointments((prev) => [...prev, newAppointment]);

      // Cerramos el modal y limpiamos campos
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
        !loading && !error && (
          <p className={styles.noAppointments}>
            No hay turnos que coincidan con el filtro seleccionado.
          </p>
        )
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
