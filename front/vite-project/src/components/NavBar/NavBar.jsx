// src/components/NavBar/NavBar.jsx
import React from "react";
// Importamos Link de react-router-dom para la navegación interna
import { Link } from "react-router-dom";
// Importamos los estilos locales usando CSS Modules
import styles from "./NavBar.module.css";

/**
 * Componente NavBar
 * Este componente muestra la barra de navegación de la aplicación.
 * Utiliza el componente Link para enlazar a las diferentes rutas definidas en la App.
 */
const NavBar = () => {
  return (
    <nav className={styles.nav}>
      {/* Título o logo de la aplicación */}
      <h1 className={styles.title}>Taller Mecánica Avanzada</h1>
      
      {/* Lista de enlaces de navegación */}
      <ul className={styles.navList}>
        {/* En cada opción de navegación se utiliza Link en lugar de <a> */}
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/appointments" className={styles.navLink}>Mis Turnos</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/about" className={styles.navLink}>About</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/contacto" className={styles.navLink}>Contacto</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/register" className={styles.navLink}>Register</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/login" className={styles.navLink}>Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
