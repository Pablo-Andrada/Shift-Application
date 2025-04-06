// src/components/NavBar/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import useUserContext from "../../hooks/useUserContext";

const NavBar = () => {
  const { user, logoutUser } = useUserContext(); // ⬅️ también traemos logoutUser
  const navigate = useNavigate();

  console.log("📌 Usuario desde NavBar:", user);

  // 🚨 Validación: mientras `user` es explícitamente `undefined` (no se cargó contexto todavía), no renderizamos
  if (typeof user === "undefined") return null;

  // Función para cerrar sesión y redirigir al home
  const handleLogout = () => {
    logoutUser();       // Cerramos sesión
    navigate("/");      // Redirigimos a Home
  };

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

        {/* 🔐 Si el usuario NO está logueado, mostramos login y register */}
        {!user && (
          <>
            <li className={styles.navItem}>
              <Link to="/register" className={styles.navLink}>Register</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/login" className={styles.navLink}>Login</Link>
            </li>
          </>
        )}

        {/* 🔓 Si el usuario está logueado, mostramos botón de cerrar sesión */}
        {user && (
          <li className={styles.navItem}>
            <button onClick={handleLogout} className={styles.navLink}>
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
