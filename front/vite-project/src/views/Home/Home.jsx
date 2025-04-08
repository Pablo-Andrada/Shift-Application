// src/views/Home/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar"; // Calendario interactivo
import "react-calendar/dist/Calendar.css"; // Estilos por defecto de react-calendar
import styles from "./Home.module.css";
import useUserContext from "../../hooks/useUserContext"; // Hook del contexto de usuario

// Importamos el componente Modal para los formularios de Login y Register
import Modal from "../../components/Modal/Modal";
// Importamos los formularios de Login y Register que se muestran en los modales
import Login from "../Login/Login";
import Register from "../Register/Register";

/**
 * Función que ajusta la fecha recibida (en formato ISO) sumándole el desfase de la zona horaria.
 * Esto permite que la fecha se muestre correctamente en la zona local.
 *
 * @param {string} dateStr - La fecha en formato ISO proveniente del backend.
 * @returns {Date} La fecha ajustada a la hora local.
 */
const adjustDate = (dateStr) => {
  const date = new Date(dateStr);
  // Suma el desfase en milisegundos que el navegador aplica a la fecha
  const adjusted = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return adjusted;
};

/**
 * Función helper para convertir un string de hora en formato "HH:MM AM/PM" a minutos.
 * Esto permite ordenar los turnos del día de forma cronológica.
 *
 * @param {string} timeStr - La hora en formato "HH:MM AM/PM"
 * @returns {number} Los minutos transcurridos desde la medianoche.
 */
const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
};

/**
 * Componente Home
 *
 * - Muestra un saludo si hay un usuario logueado.
 * - Si el usuario está logueado, muestra dos columnas:
 *    - Columna Izquierda:
 *         1. Widget: Tu próximo turno.
 *         2. Widget: Historial de Turnos (últimos 3).
 *    - Columna Derecha:
 *         1. Widget: Calendario de Turnos.
 *         2. Widget: Turnos para la fecha seleccionada (ordenados de más temprano a más tarde).
 * - Si el usuario no está logueado, muestra un mensaje genérico y botones para iniciar sesión o registrarse.
 */
function Home() {
  // Obtenemos el usuario desde el contexto global
  const { user } = useUserContext();

  // Estados para controlar la apertura de los modales de Login y Register
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Estado para almacenar el próximo turno activo del usuario
  const [nextAppointment, setNextAppointment] = useState(null);
  // Estado para almacenar todos los turnos del usuario (para mini historial y calendario)
  const [allAppointments, setAllAppointments] = useState([]);

  // Estado que controla la fecha seleccionada en el calendario
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * Función para obtener los turnos del usuario desde el backend.
   * Se encarga de:
   * - Guardar el arreglo completo de turnos en allAppointments.
   * - Calcular el próximo turno activo (usando adjustDate para corregir la zona horaria).
   */
  const fetchAppointments = useCallback(async () => {
    if (!user) return; // Si no hay usuario, no hacemos nada
    try {
      const response = await fetch(`http://localhost:3000/appointments/user/${user.id}`);
      if (!response.ok) {
        throw new Error("No se pudieron obtener los turnos.");
      }
      const appointments = await response.json();
      // Guardamos todos los turnos para el mini historial y calendario
      setAllAppointments(appointments);

      const now = new Date();
      // Filtramos los turnos activos posteriores o iguales a la fecha actual
      const upcomingAppointments = appointments.filter((appt) => {
        const adjDate = adjustDate(appt.date);
        return adjDate >= now && appt.status === "active";
      });
      // Ordenamos ascendentemente para obtener el turno más cercano (ajustado a la hora local)
      upcomingAppointments.sort((a, b) => adjustDate(a.date) - adjustDate(b.date));
      // Guardamos el turno más cercano, o null si no existe ninguno
      setNextAppointment(upcomingAppointments.length > 0 ? upcomingAppointments[0] : null);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
    }
  }, [user]);

  /**
   * useEffect para cargar los turnos del usuario al montarse el componente y refrescarlos cada 30 segundos.
   */
  useEffect(() => {
    fetchAppointments();
    // Refresca turnos cada 30 segundos
    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000);
    return () => clearInterval(interval);
  }, [user, fetchAppointments]);

  /**
   * miniHistory:
   * Calcula los 3 turnos más recientes del historial (ordenados por fecha descendente)
   * y ajusta las fechas a la hora local.
   */
  const miniHistory =
    allAppointments.length > 0
      ? [...allAppointments]
          .sort((a, b) => adjustDate(b.date) - adjustDate(a.date))
          .slice(0, 3)
      : [];

  /**
   * dailyAppointments:
   * Filtra y lista los turnos programados para la fecha seleccionada en el calendario.
   * Se usa adjustDate para corregir el desfase horario y se ordenan por la hora (de más temprano a más tarde).
   */
  const dailyAppointments = allAppointments
    .filter((appt) => {
      const apptDate = adjustDate(appt.date);
      return (
        apptDate.getFullYear() === selectedDate.getFullYear() &&
        apptDate.getMonth() === selectedDate.getMonth() &&
        apptDate.getDate() === selectedDate.getDate()
      );
    })
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  /**
   * handleDateChange:
   * Actualiza la fecha seleccionada del calendario.
   *
   * @param {Date} date - La nueva fecha seleccionada.
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.homeContainer}>
      {/* Saludo personalizado si hay usuario; de lo contrario, mensaje genérico y botones de autenticación */}
      {user ? (
        <p className={styles.title}>Hola {user.name} 👋 ¡Bienvenido al taller!</p>
      ) : (
        <>
          <h2 className={styles.title}>
            Taller Automotriz: Mecánica avanzada al instante.
          </h2>
          <div className={styles.authButtonsContainer}>
            <button onClick={() => setIsLoginOpen(true)} className={styles.actionButton}>
              Iniciar Sesión
            </button>
            <button onClick={() => setIsRegisterOpen(true)} className={styles.actionButton}>
              Registrarse
            </button>
          </div>
        </>
      )}

      {/* Renderizamos widgets sólo si hay usuario logueado */}
      {user && (
        <div className={styles.layoutContainer}>
          {/* ================= Columna Izquierda ================= */}
          <div className={styles.leftColumn}>
            {/* Widget: Tu próximo turno */}
            <div className={styles.widgetContainer}>
              <div className={styles.widgetHeader}>Tu próximo turno</div>
              <div className={styles.widgetBody}>
                {nextAppointment ? (
                  <p className={styles.nextAppointmentDetails}>
                    {adjustDate(nextAppointment.date).toLocaleDateString()} a las {nextAppointment.time}
                    <span
                      className={
                        nextAppointment.status === "active"
                          ? `${styles.statusBadge} ${styles.activeBadge}`
                          : `${styles.statusBadge} ${styles.cancelledBadge}`
                      }
                    >
                      {nextAppointment.status}
                    </span>
                  </p>
                ) : (
                  <p className={styles.nextAppointmentDetails}>No tienes turnos programados.</p>
                )}
              </div>
            </div>

            {/* Widget: Historial de Turnos */}
            <div className={styles.widgetContainer}>
              <div className={styles.widgetHeader}>Historial de Turnos</div>
              <div className={styles.widgetBody}>
                {miniHistory.length > 0 ? (
                  <ul className={styles.historyList}>
                    {miniHistory.map((appt) => (
                      <li key={appt.id} className={styles.historyItem}>
                        {adjustDate(appt.date).toLocaleDateString()} - {appt.time} -{" "}
                        <span
                          className={
                            appt.status === "active"
                              ? `${styles.statusBadge} ${styles.activeBadge}`
                              : `${styles.statusBadge} ${styles.cancelledBadge}`
                          }
                        >
                          {appt.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.historyDetails}>No hay turnos en tu historial.</p>
                )}
              </div>
            </div>
          </div>

          {/* ================= Columna Derecha ================= */}
          <div className={styles.rightColumn}>
            {/* Widget: Calendario de Turnos */}
            <div className={styles.widgetContainer}>
              <div className={styles.widgetHeader}>Calendario de Turnos</div>
              <div className={styles.widgetBody}>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileContent={({ date, view }) => {
                    if (view === "month") {
                      // Determina si hay turnos en la fecha 'date'
                      const hasTurno = allAppointments.some((appt) => {
                        const apptDate = adjustDate(appt.date);
                        return (
                          apptDate.getFullYear() === date.getFullYear() &&
                          apptDate.getMonth() === date.getMonth() &&
                          apptDate.getDate() === date.getDate()
                        );
                      });
                      // Retornamos un indicador (círculo) si la fecha tiene turnos
                      return hasTurno ? <div className={styles.turnoIndicator} /> : null;
                    }
                  }}
                />
              </div>
            </div>

            {/* Widget: Turnos para la Fecha Seleccionada */}
            <div className={styles.widgetContainer}>
              <div className={styles.widgetHeader}>
                Turnos para {selectedDate.toLocaleDateString()}
              </div>
              <div className={styles.widgetBody}>
                {dailyAppointments.length > 0 ? (
                  <ul className={styles.dayTurnosList}>
                    {dailyAppointments.map((appt) => (
                      <li key={appt.id} className={styles.dayTurnoItem}>
                        {adjustDate(appt.date).toLocaleDateString()} - {appt.time} -{" "}
                        <span
                          className={
                            appt.status === "active"
                              ? `${styles.statusBadge} ${styles.activeBadge}`
                              : `${styles.statusBadge} ${styles.cancelledBadge}`
                          }
                        >
                          {appt.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noTurnosMessage}>
                    No hay turnos programados para este día.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Login */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login onClose={() => setIsLoginOpen(false)} />
      </Modal>

      {/* Modal para Register */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <Register onClose={() => setIsRegisterOpen(false)} />
      </Modal>
    </div>
  );
}

export default Home;
