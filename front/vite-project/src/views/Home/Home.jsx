// src/views/Home/Home.jsx
import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import useUserContext from "../../hooks/useUserContext"; // Importa el custom hook del contexto de usuario

// Importamos el componente Modal (reutilizable para mostrar formularios)
import Modal from "../../components/Modal/Modal";
// Importamos los formularios de Login y Register que se muestran en los modales
import Login from "../Login/Login";
import Register from "../Register/Register";

/**
 * Componente Home
 * - Muestra el fondo del taller y un mensaje de bienvenida.
 * - Si el usuario no está logueado, muestra botones para abrir los formularios de Login y Register.
 * - Si el usuario está logueado, muestra un saludo personalizado junto con:
 *      1. Un widget que indica el próximo turno activo.
 *      2. Un mini historial de turnos (últimos 3) con fecha, hora y estado, mostrando una insignia de estado.
 */
function Home() {
  // Obtenemos el usuario del contexto global
  const { user } = useUserContext();

  // Estados locales para controlar la visibilidad de los modales de Login y Register
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Estado para almacenar el próximo turno activo del usuario
  const [nextAppointment, setNextAppointment] = useState(null);
  // Estado para almacenar todos los turnos (para calcular el mini historial)
  const [allAppointments, setAllAppointments] = useState([]);

  /**
   * useEffect:
   * Si hay un usuario logueado, se realiza una petición al backend para obtener sus turnos.
   * - Se filtran los turnos activos cuya fecha sea mayor o igual a la actual para determinar el "próximo turno".
   * - Se guarda el arreglo completo de turnos para calcular el mini historial.
   */
  useEffect(() => {
    if (!user) return; // Si no hay usuario, no hacemos nada

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/appointments/user/${user.id}`);
        if (!response.ok) {
          throw new Error("No se pudieron obtener los turnos.");
        }
        const appointments = await response.json();

        // Guardamos todos los turnos para el mini historial
        setAllAppointments(appointments);

        const now = new Date();
        // Filtramos los turnos activos posteriores o iguales a la fecha actual
        const upcomingAppointments = appointments.filter(
          (appt) => new Date(appt.date) >= now && appt.status === "active"
        );
        // Ordenamos ascendentemente para obtener el turno más cercano
        upcomingAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        // Guardamos el turno más cercano o null si no existe ninguno
        setNextAppointment(upcomingAppointments.length > 0 ? upcomingAppointments[0] : null);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  /**
   * miniHistory:
   * Calcula el mini historial de turnos mostrando los 3 turnos más recientes.
   * Se ordena el arreglo completo de turnos en forma descendente según la fecha.
   */
  const miniHistory =
    allAppointments.length > 0
      ? [...allAppointments]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
      : [];

  return (
    <div className={styles.homeContainer}>
      {/* Si hay usuario, se muestra un saludo personalizado junto con los widgets */}
      {user ? (
        <>
          <p className={styles.title}>Hola {user.name} 👋 ¡Bienvenido al taller!</p>
          
          {/* Contenedor para los widgets: Próximo turno y Mini Historial */}
          <div className={styles.widgetsContainer}>
            {/* Widget del Próximo Turno */}
            <div className={styles.widgetContainer}>
              <div className={styles.widgetHeader}>
                Tu próximo turno
              </div>
              <div className={styles.widgetBody}>
                {nextAppointment ? (
                  <p className={styles.nextAppointmentDetails}>
                    {new Date(nextAppointment.date).toLocaleDateString()} a las {nextAppointment.time}
                    <span className={nextAppointment.status === "active" ? `${styles.statusBadge} ${styles.activeBadge}` : `${styles.statusBadge} ${styles.cancelledBadge}`}>
                      {nextAppointment.status}
                    </span>
                  </p>
                ) : (
                  <p className={styles.nextAppointmentDetails}>No tienes turnos programados.</p>
                )}
              </div>
            </div>

            {/* Mini Historial de Turnos */}
            <div className={styles.widgetContainer}>
              <div className={styles.widgetHeader}>
                Historial de Turnos
              </div>
              <div className={styles.widgetBody}>
                {miniHistory.length > 0 ? (
                  <ul className={styles.historyList}>
                    {miniHistory.map((appt) => (
                      <li key={appt.id} className={styles.historyItem}>
                        {new Date(appt.date).toLocaleDateString()} - {appt.time} - 
                        <span className={appt.status === "active" ? `${styles.statusBadge} ${styles.activeBadge}` : `${styles.statusBadge} ${styles.cancelledBadge}`}>
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
        </>
      ) : (
        <>
          {/* Si no hay usuario, se muestra un mensaje genérico y botones de autenticación */}
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
