// src/components/NavBar/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom"; // Importamos Link
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>Taller Mecánica avanzada</h1>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
         <Link to="/login" className={styles.navLink}>Iniciar Sesión</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/register" className={styles.navLink}>Registrarse</Link>
        </li>
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
      </ul>
    </nav>
  );
}

export default NavBar;
