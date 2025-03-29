// src/components/NavBar/NavBar.jsx
import React from "react";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>Taller Mecánica avanzada</h1>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/" className={styles.navLink}>Home</a>
        </li>
        <li className={styles.navItem}>
          <a href="/appointments" className={styles.navLink}>Mis Turnos</a>
        </li>
        <li className={styles.navItem}>
          <a href="/about" className={styles.navLink}>About</a>
        </li>
        <li className={styles.navItem}>
          <a href="/contacto" className={styles.navLink}>Contacto</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
