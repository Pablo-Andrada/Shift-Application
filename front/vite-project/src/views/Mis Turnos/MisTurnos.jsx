// src/views/Mis Turnos/MisTurnos.jsx
import React, { useEffect, useState } from "react";
// Importamos los estilos locales
import styles from "./MisTurnos.module.css";
// Importamos el hook de contexto para acceder al usuario logueado
import useUserContext from "../../hooks/useUserContext";
// Importamos el componente AppointmentCard para mostrar cada turno
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
// Importamos la función toast de react-toastify para mostrar notificaciones en vez del popup nativo
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

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
  // NUEVO ESTADO: Comentarios para el turno (máximo 50 caracteres)
  const [newComentarios, setNewComentarios] = useState("");

  /**
   * useEffect:
   * Al montar el componente, realiza una petición al backend para obtener los turnos del usuario.
   * Se guarda el arreglo de turnos en 'appointments'.
   */
  useEffect(() => {
    if (!user) return; // Si no hay usuario, no hacemos nada

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API}/appointments/user/${user.id}`);
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
   * Se muestra una notificación mediante toast.
   *
   * @param {number} id - ID del turno a cancelar.
   */
  const handleCancel = async (id) => {
    try {
      const response = await fetch(`${API}/appointments/cancel/${id}`, {
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
      toast.success("Turno cancelado exitosamente");
    } catch (err) {
      console.error("Error al cancelar turno:", err.message);
      setError(err.message);
      toast.error("Error al cancelar el turno");
    }
  };

  /**
   * handleDismiss:
   * Función para eliminar un turno:
   * 1. Se llama al endpoint DELETE del backend para eliminar el turno de la base de datos.
   * 2. Si la eliminación es exitosa, se actualiza el estado local de los turnos para remover la tarjeta.
   *
   * @param {number} id - ID del turno a eliminar.
   */
  const handleDismiss = async (id) => {
    try {
      // Realizamos la petición DELETE para eliminar el turno en el backend
      const response = await fetch(`${API}/appointments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("No se pudo eliminar el turno.");
      }
      toast.success("Turno eliminado exitosamente");
      // Actualizamos el estado: removemos el turno de la lista
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt.id !== id)
      );
    } catch (err) {
      console.error("Error al eliminar el turno:", err.message);
      toast.error("Error al eliminar el turno");
    }
  };

  /**
   * handleCreateAppointment:
   * Envía el nuevo turno al backend y actualiza la lista de turnos si todo sale bien.
   * Se incluye el campo "comentarios" en la petición.
   */
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/appointments/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: newDate,
          time: newTime,
          userId: user.id,
          comentarios: newComentarios,
        }),
      });
      if (!response.ok) {
        throw new Error("No se pudo crear el turno.");
      }
      const newAppointment = await response.json();
      // Actualizamos la lista de turnos con el nuevo turno creado
      setAppointments((prev) => [...prev, newAppointment]);
      // Cerramos el modal y limpiamos los campos (incluyendo comentarios)
      setIsModalOpen(false);
      setNewDate("");
      setNewTime("");
      setNewComentarios("");
    } catch (err) {
      console.error("Error al crear turno:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Turnos</h2>

      {/* Controles: filtro y botón para crear nuevo turno */}
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

      {/* Lista de turnos filtrados */}
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
              comentarios={appt.comentarios}
              onCancel={handleCancel}
              onDismiss={handleDismiss}
            />
          ))}
        </ul>
      ) : (
        !loading &&
        !error && (
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
              <label>
                Comentarios (máx. 50 caracteres):
                <input
                  type="text"
                  value={newComentarios}
                  maxLength={50}
                  onChange={(e) => setNewComentarios(e.target.value)}
                  placeholder="Escribe un comentario (opcional)"
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
