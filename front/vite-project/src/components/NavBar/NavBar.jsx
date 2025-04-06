// src/components/NavBar/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import useUserContext from "../../hooks/useUserContext";

const NavBar = () => {
  const { user } = useUserContext();

  console.log("📌 Usuario desde NavBar:", user);

  // 🚨 Validación: mientras `user` es explícitamente `undefined` (no se cargó contexto todavía), no renderizamos
  if (typeof user === "undefined") return null;

  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>Taller Mecánica Avanzada</h1>

      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>Home</Link>
        </li>

        {user && (
          <li className={styles.navItem}>
            <Link to="/appointments" className={styles.navLink}>Mis Turnos</Link>
          </li>
        )}

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
