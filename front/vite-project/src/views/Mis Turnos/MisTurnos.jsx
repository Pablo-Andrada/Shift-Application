// src/views/Mis Turnos/MisTurnos.jsx
import React, { useEffect, useState } from "react";
// Importamos los estilos locales
import styles from "./MisTurnos.module.css";
// Importamos el hook de contexto para acceder al usuario logueado
import useUserContext from "../../hooks/useUserContext";

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

  // Nuevo estado para el filtro de estado
  const [filterStatus, setFilterStatus] = useState("todos");

  /**
   * useEffect:
   * Cuando el componente se monta, se hace una petición al backend para obtener los turnos del usuario logueado.
   */
  useEffect(() => {
    // Validamos que exista un usuario (por seguridad extra)
    if (!user) return;

    // Función asincrónica para obtener los turnos desde el backend
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/appointments/user/${user.id}`);

        if (!response.ok) {
          throw new Error("No se pudieron obtener los turnos.");
        }

        const data = await response.json();
        setAppointments(data); // Guardamos los turnos en el estado
        setError(null);        // Limpiamos cualquier error previo
      } catch (err) {
        console.error(err);
        setError(err.message); // Guardamos el mensaje de error
      } finally {
        setLoading(false);     // Indicamos que la carga terminó
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

  // Filtramos los turnos según el estado elegido
  const filteredAppointments =
    filterStatus === "todos"
      ? appointments
      : appointments.filter((appt) => appt.status === filterStatus);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Turnos</h2>

      {/* Select para filtrar por estado */}
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
      </div>

      {loading && <p className={styles.loading}>Cargando turnos...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* Renderizamos la lista de turnos filtrados */}
      {!loading && !error && filteredAppointments.length > 0 ? (
        <ul className={styles.appointmentList}>
          {filteredAppointments.map((appt) => (
            <li key={appt.id} className={styles.appointmentItem}>
              <strong>Fecha:</strong> {new Date(appt.date).toLocaleDateString()} <br />
              <strong>Hora:</strong> {appt.time} <br />
              <strong>Servicio:</strong> {appt.service || "N/A"} <br />
              <strong>Estado:</strong> {appt.status}
            </li>
          ))}
        </ul>
      ) : (
        !loading &&
        !error && <p className={styles.noAppointments}>No hay turnos que coincidan con el filtro seleccionado.</p>
      )}
    </div>
  );
};

export default MisTurnos;
