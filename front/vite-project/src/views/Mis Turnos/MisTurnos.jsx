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
  // Obtenemos el usuario actual desde el contexto global
  const { user } = useUserContext();

  // Estado para almacenar los turnos del usuario
  const [appointments, setAppointments] = useState([]);
  // Estado para manejar errores en la petición
  const [error, setError] = useState(null);
  // Estado para saber si estamos cargando los turnos
  const [loading, setLoading] = useState(true);
  // Estado para el filtro de turnos (todos, active, cancelled)
  const [filterStatus, setFilterStatus] = useState("todos");

  // Estados para controlar el modal de creación de turno
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  /**
   * useEffect:
   * Al montar el componente, realiza una petición al backend para obtener los turnos del usuario.
   * Se guarda el arreglo de turnos en 'appointments'.
   */
  useEffect(() => {
    if (!user) return; // Si no hay usuario, no hacemos nada

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
   * Actualiza el estado del filtro cuando el usuario selecciona una opción en el select.
   */
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  /**
   * filteredAppointments:
   * Aplica el filtro de estado a la lista de turnos.
   */
  const filteredAppointments =
    filterStatus === "todos"
      ? appointments
      : appointments.filter((appt) => appt.status === filterStatus);

  /**
   * handleCancel:
   * Función para cancelar un turno.
   * Envía una petición PUT al backend para actualizar el estado del turno a "cancelled"
   * y actualiza el estado local de los turnos.
   *
   * @param {number} id - ID del turno a cancelar.
   */
  const handleCancel = async (id) => {
    // Preguntamos al usuario si realmente quiere cancelar el turno
    const confirm = window.confirm("¿Estás seguro que querés cancelar este turno?");
    if (!confirm) return;
    try {
      const response = await fetch(`http://localhost:3000/appointments/cancel/${id}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("No se pudo cancelar el turno.");
      }
      // Actualizamos el estado: marcamos el turno como 'cancelled'
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
      // Actualizamos la lista de turnos con el nuevo turno creado
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
            // Se pasa handleCancel como prop al componente AppointmentCard para cancelar un turno
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
