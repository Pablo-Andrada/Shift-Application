import React, { useState } from "react";
import styles from "./Login.module.css";
import useUserContext from "../../hooks/useUserContext";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Login = ({ onClose }) => {
    const navigate = useNavigate();
    const { loginUser } = useUserContext();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        if (!email || !password) { setStatusMessage("Completá todos los campos."); setIsError(true); return; }

        try {
            const response = await fetch(`${API}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok || !data.user) {
                setStatusMessage(data.message || "Credenciales inválidas."); setIsError(true);
            } else {
                setIsError(false);
                loginUser(data.user);
                if (onClose) onClose();
                navigate(data.user.role === "admin" ? "/admin" : "/");
            }
        } catch {
            setStatusMessage("Error al conectar con el servidor."); setIsError(true);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logoArea}>
                    <span className={styles.logoIcon}>🔧</span>
                    <h1 className={styles.title}>Bienvenido</h1>
                    <p className={styles.subtitle}>Ingresá a tu cuenta del taller</p>
                </div>

                {statusMessage && (
                    <div className={isError ? styles.errorMessage : styles.successMessage}>
                        {statusMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email}
                            onChange={handleChange} placeholder="tu@email.com" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" value={formData.password}
                            onChange={handleChange} placeholder="••••••••" required />
                    </div>
                    <button type="submit" className={styles.submitButton}>Iniciar sesión</button>
                </form>

                <p className={styles.footer}>
                    ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
