import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserContext from "../../hooks/useUserContext";
import styles from "./Register.module.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Register = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "", email: "", birthdate: "", nDni: "",
        password: "", confirmPassword: "", adminCode: ""
    });
    const [showAdminCode, setShowAdminCode] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();
    const { loginUser } = useUserContext();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, birthdate, nDni, password, confirmPassword, adminCode } = formData;

        if (!name || !email || !birthdate || !nDni || !password || !confirmPassword) {
            setIsError(true);
            setStatusMessage("Por favor, complete todos los campos.");
            return;
        }
        if (password !== confirmPassword) {
            setIsError(true);
            setStatusMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(`${API}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, email,
                    birthdate: new Date(birthdate).toISOString(),
                    nDni, password,
                    adminCode: adminCode || undefined
                })
            });

            let data = null;
            const ct = response.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
                try { data = await response.json(); } catch (_) {}
            }

            if (!response.ok) {
                setIsError(true);
                setStatusMessage(data?.message || `Error ${response.status}`);
                return;
            }

            setIsError(false);
            const isAdminReg = data?.role === "admin";
            setStatusMessage(isAdminReg
                ? "¡Cuenta de administrador creada con éxito!"
                : "¡Usuario registrado con éxito! Redirigiendo...");

            if (data && data.email) {
                loginUser && loginUser(data);
                if (onClose) onClose();
                setTimeout(() => navigate(isAdminReg ? "/admin" : "/"), 1500);
            } else {
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            setIsError(true);
            setStatusMessage("Error al enviar la solicitud. Intente más tarde.");
        }
    };

    const isFormValid = formData.name && formData.email && formData.birthdate &&
        formData.nDni && formData.password && formData.confirmPassword;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Crear Cuenta</h1>

            {statusMessage && (
                <div className={isError ? styles.errorMessage : styles.successMessage}>
                    {statusMessage}
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre completo:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="birthdate">Fecha de Nacimiento:</label>
                    <input type="date" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="nDni">Número de DNI:</label>
                    <input type="text" id="nDni" name="nDni" value={formData.nDni} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                {/* Código admin opcional */}
                <div className={styles.formGroup}>
                    <button
                        type="button"
                        className={styles.adminToggle}
                        onClick={() => setShowAdminCode(!showAdminCode)}
                    >
                        {showAdminCode ? "▲ Ocultar código de taller" : "▼ ¿Tenés código de taller?"}
                    </button>
                    {showAdminCode && (
                        <input
                            type="password"
                            id="adminCode"
                            name="adminCode"
                            placeholder="Código de administrador"
                            value={formData.adminCode}
                            onChange={handleChange}
                            className={styles.adminCodeInput}
                        />
                    )}
                </div>

                <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
