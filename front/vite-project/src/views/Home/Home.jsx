// src/views/Home/Home.jsx
import React from "react";
import styles from "./Home.module.css";
import useUserContext from "../../hooks/useUserContext"; // ✅ Importamos el custom hook del contexto

/**
 * Componente Home
 * Muestra el mensaje principal del taller y, si hay un usuario logueado, lo saluda por su nombre.
 */
function Home() {
  // ✅ Obtenemos el usuario actual desde el contexto global
  const { user } = useUserContext();

  return (
    <div className={styles.homeContainer}>
      {/* ✅ Si hay un usuario logueado, lo saludamos por su nombre */}
      {user && (
        <p className={styles.title}>
          Hola {user.username} 👋 ¡Bienvenido al taller!
        </p>
      )}

      {/* ✅ Encabezado o contenido principal original que ya tenías */}
      <h2 className={styles.title}>
        Taller Automotriz: Mecánica avanzada al instante.
      </h2>
    </div>
  );
}

export default Home;



