// src/views/Home/Home.jsx
import React, { useState } from "react";
import styles from "./Home.module.css";
import useUserContext from "../../hooks/useUserContext";
// Importamos el componente Modal (reutilizable para mostrar formularios)
import Modal from "../../components/Modal/Modal";
// Importamos los formularios de Login y Register que se mostrarán en los modales
import Login from "../Login/Login";
import Register from "../Register/Register";

/**
 * Componente Home
 * Muestra el fondo del taller, un mensaje de bienvenida y, si el usuario no está logueado,
 * muestra botones para abrir modales con los formularios de Login y Register.
 * Si el usuario ya está logueado, muestra un saludo personalizado.
 */
function Home() {
  const { user } = useUserContext();
  // Estados locales para controlar la visibilidad de los modales de Login y Register
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className={styles.homeContainer}>
      {/* Si hay usuario, lo saludamos; si no, mostramos un mensaje genérico */}
      {user ? (
        <p className={styles.title}>Hola {user.username} 👋 ¡Bienvenido al taller!</p>
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

      {/* Modal para Login. Se cierra automáticamente al iniciar sesión (ver Login.jsx) */}
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
