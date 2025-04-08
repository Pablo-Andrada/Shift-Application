// src/components/NavBar/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import useUserContext from "../../hooks/useUserContext";

/**
 * Componente NavBar
 * Muestra la barra de navegación de la aplicación.
 *
 * - Si el usuario está logueado, se muestra el enlace a "Mis Turnos"
 *   y un botón para "Cerrar sesión".
 * - Si el usuario no está logueado, no se muestran las opciones de login y registro,
 *   ya que esos formularios se encuentran en el Home.
 *
 * La función handleLogout se encarga de limpiar el usuario del contexto
 * y redireccionar al Home.
 */
const NavBar = () => {
  // Obtenemos del contexto el usuario y la función para cerrar sesión.
  const { user, logoutUser } = useUserContext();
  const navigate = useNavigate();

  // Imprimimos en consola para debug (verificar si el usuario está cargado)
  console.log("📌 Usuario desde NavBar:", user);

  // Mientras el contexto aún no se haya cargado (user es undefined), no renderizamos nada.
  if (typeof user === "undefined") return null;

  /**
   * handleLogout:
   * Llama a la función del contexto para cerrar sesión (logoutUser)
   * y redirige al usuario a la ruta Home ("/").
   */
  const handleLogout = () => {
    logoutUser();       // Elimina el usuario del contexto
    navigate("/");      // Redirige al Home
  };

  return (
    <nav className={styles.nav}>
      {/* Título o logo de la aplicación */}
      <h1 className={styles.title}>Taller Mecánica Avanzada</h1>

      <ul className={styles.navList}>
        {/* Enlace a Home */}
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>Home</Link>
        </li>

        {user && (
          <li className={styles.navItem}>
            <Link to="/appointments" className={styles.navLink}>Mis Turnos</Link>
          </li>
        )}

        <li className={styles.navItem}>
          <Link to="/contacto" className={styles.navLink}>Contacto</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/about" className={styles.navLink}>About</Link>
        </li>

        {/* Si hay usuario, mostramos el botón "Cerrar sesión" */}
        {user && (
          <li className={styles.navItem}>
            <button onClick={handleLogout} className={`${styles.navLink} ${styles.navButton}`}>
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
