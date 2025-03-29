// src/components/NavBar/NavBar.jsx
import React from "react";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>Taller Mecánica avanzada</h1>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/" className={styles.navLink}>Inicio</a>
        </li>
        <li className={styles.navItem}>
          <a href="/appointments" className={styles.navLink}>Turnos</a>
        </li>
        <li className={styles.navItem}>
          <a href="/login" className={styles.navLink}>Login</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
