import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import useUserContext from "../../hooks/useUserContext";

const NavBar = () => {
    const { user, logoutUser, isAdmin } = useUserContext();
    const navigate = useNavigate();

    if (typeof user === "undefined") return null;

    const handleLogout = () => { logoutUser(); navigate("/"); };

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>
                <span className={styles.brandIcon}>🔧</span>
                <h1 className={styles.title}>
                    Mecánica <span className={styles.titleAccent}>Avanzada</span>
                </h1>
            </div>

            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/" className={styles.navLink}>Inicio</Link>
                </li>

                {user && !isAdmin && (
                    <li className={styles.navItem}>
                        <Link to="/appointments" className={styles.navLink}>Mis Turnos</Link>
                    </li>
                )}

                {user && isAdmin && (
                    <li className={styles.navItem}>
                        <Link to="/admin" className={`${styles.navLink} ${styles.adminLink}`}>
                            ⚙️ Panel Admin
                        </Link>
                    </li>
                )}

                <li className={styles.navItem}>
                    <Link to="/contacto" className={styles.navLink}>Contacto</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/about" className={styles.navLink}>Nosotros</Link>
                </li>

                {user ? (
                    <li className={styles.navItem}>
                        <span className={styles.userGreeting}>Hola, {user.name.split(" ")[0]}</span>
                        <button onClick={handleLogout} className={styles.navButton}>
                            Salir
                        </button>
                    </li>
                ) : (
                    <>
                        <li className={styles.navItem}>
                            <Link to="/login" className={styles.navLink}>Ingresar</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link to="/register" className={styles.navLink}>Registrarse</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
