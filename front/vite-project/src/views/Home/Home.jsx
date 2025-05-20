// src/views/Home/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar"; // Calendario interactivo
import "react-calendar/dist/Calendar.css"; // Estilos por defecto de react-calendar
import styles from "./Home.module.css";
import useUserContext from "../../hooks/useUserContext"; // Hook del contexto de usuario

// Importamos el componente Modal para los formularios de Login y Register
import Modal from "../../components/Modal/Modal";
import Login from "../Login/Login";
import Register from "../Register/Register";

const API = import.meta.env.VITE_API_URL;

/**
 * Función que ajusta la fecha recibida (en formato ISO) sumándole el desfase de la zona horaria.
 * Esto permite que la fecha se muestre correctamente en la hora local del navegador.
 *
 * @param {string} dateStr - La fecha en formato ISO proveniente del backend.
 * @returns {Date} La fecha ajustada a la hora local.
 */
const adjustDate = (dateStr) => {
  const date = new Date(dateStr);
  // Suma el desfase (en milisegundos) que el navegador aplica a la fecha
  const adjusted = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return adjusted;
};

/**
 * Función helper para convertir un string de hora en formato "HH:MM AM/PM" a minutos.
 * Permite ordenar los turnos de un día en orden cronológico.
 *
 * @param {string} timeStr - Formato "HH:MM AM" o "HH:MM PM".
 * @returns {number} Minutos totales desde la medianoche.
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
 * - Si el usuario está logueado, muestra 2 columnas:
 *   - Izquierda: Próximo turno y mini-historial (últimos 3).
 *   - Derecha: Calendario de turnos y turnos para la fecha seleccionada.
 * - Si no hay usuario, muestra un mensaje genérico y botones de Login/Register.
 */
function Home() {
  // Obtenemos el usuario actual desde el contexto global
  const { user } = useUserContext();

  // Manejo de modales (Login y Register)
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Estado para el próximo turno activo
  const [nextAppointment, setNextAppointment] = useState(null);
  // Estado con todos los turnos del usuario
  const [allAppointments, setAllAppointments] = useState([]);

  // Fecha seleccionada en el calendario
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * fetchAppointments:
   * Obtiene la lista de turnos del backend y determina el próximo turno activo.
   */
  const fetchAppointments = useCallback(async () => {
    if (!user) return; // Si no hay usuario, no hacemos nada

    try {
      // 1) Pedimos los turnos del usuario al backend
      const response = await fetch(`${API}/appointments/user/${user.id}`);
      if (!response.ok) {
        throw new Error("No se pudieron obtener los turnos.");
      }
      const appointments = await response.json();

      // 2) Guardamos todos los turnos en estado
      setAllAppointments(appointments);

      // 3) Determinamos el "próximo turno activo" comparando la fecha ajustada
      const now = new Date();
      const upcomingAppointments = appointments.filter((appt) => {
        const adjDate = adjustDate(appt.date);
        return adjDate >= now && appt.status === "active";
      });

      // Ordenamos por fecha ajustada ascendentemente
      upcomingAppointments.sort((a, b) => adjustDate(a.date) - adjustDate(b.date));

      // Si hay alguno, guardamos el primero como el más cercano
      setNextAppointment(upcomingAppointments.length > 0 ? upcomingAppointments[0] : null);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
    }
  }, [user]);

  /**
   * useEffect principal:
   * Al montar el componente y cada cierto intervalo, refresca la lista de turnos.
   * Así, si creas un turno en MisTurnos, se reflejará aquí (aunque estés en la misma sesión).
   */
  useEffect(() => {
    // Hacemos la primera carga
    fetchAppointments();

    // Intervalo para refrescar turnos cada 5 segundos
    const interval = setInterval(() => {
      fetchAppointments();
    }, 1000);

    return () => clearInterval(interval);
  }, [user, fetchAppointments]);

  /**
   * miniHistory:
   * Sacamos los 3 turnos más recientes, sin importar estado, y ajustamos sus fechas.
   */
  const miniHistory =
    allAppointments.length > 0
      ? [...allAppointments]
          .sort((a, b) => adjustDate(b.date) - adjustDate(a.date))
          .slice(0, 3)
      : [];

  /**
   * dailyAppointments:
   * Turnos para la fecha seleccionada en el calendario, ordenados por hora de menor a mayor.
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
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.homeContainer}>
      {/** 
       * Si hay usuario, lo saludamos con su name.
       * Si no hay, mostramos un título genérico y los botones de Login/Register.
       */}
      {user ? (
        <p className={styles.title}>Hola {user.name} 👋 ¡Bienvenido al taller!</p>
      ) : (
        <>
          <h2 className={styles.title}>Taller Automotriz: Mecánica avanzada al instante.</h2>
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

      {/**
       * Solo mostramos los widgets si el usuario está logueado
       */}
      {user && (
        <div className={styles.layoutContainer}>
          {/** ==================== Columna Izquierda ==================== */}
          <div className={styles.leftColumn}>
            {/** Widget: Tu próximo turno */}
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

            {/** Widget: Historial de Turnos */}
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

          {/** ==================== Columna Derecha ==================== */}
          <div className={styles.rightColumn}>
            {/** Calendario de Turnos */}
            <div className={styles.widgetContainer}>
              <div className={styles.widgetHeader}>Calendario de Turnos</div>
              <div className={styles.widgetBody}>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileContent={({ date, view }) => {
                    if (view === "month") {
                      // ¿Hay turnos en esa fecha?
                      const hasTurno = allAppointments.some((appt) => {
                        const apptDate = adjustDate(appt.date);
                        return (
                          apptDate.getFullYear() === date.getFullYear() &&
                          apptDate.getMonth() === date.getMonth() &&
                          apptDate.getDate() === date.getDate()
                        );
                      });
                      return hasTurno ? <div className={styles.turnoIndicator} /> : null;
                    }
                  }}
                />
              </div>
            </div>

            {/** Turnos del día seleccionado */}
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

      {/** Modales de Login y Register */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login onClose={() => setIsLoginOpen(false)} />
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <Register onClose={() => setIsRegisterOpen(false)} />
      </Modal>
    </div>
  );
}

export default Home;
