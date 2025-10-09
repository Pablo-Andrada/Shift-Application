// src/views/Register/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para redireccionar
import useUserContext from "../../hooks/useUserContext"; // Hook del contexto de usuario
import styles from "./Register.module.css";

/**
 * Uso de VITE_API_URL con fallback:
 * Si la variable de entorno no está definida (por ejemplo en dev sin .env.local),
 * usamos http://localhost:3000 para evitar que API quede undefined y produzca llamadas a undefined/...
 */
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Componente Register
 * Se mantiene toda la lógica original: validaciones, conversión de fecha a ISO,
 * auto-login si el backend devuelve email (o datos del usuario), onClose y redirect.
 * Cambios principales: manejo seguro de response.json() y logs descriptivos.
 */
const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    nDni: "",
    password: "",
    confirmPassword: ""
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useUserContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, birthdate, nDni, password, confirmPassword } = formData;

    // Validaciones
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
      const url = `${API}/user/register`;
      console.log("[Register] POST ->", url);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          birthdate: new Date(birthdate).toISOString(),
          nDni,
          password
        })
      });

      // Intentamos detectar si hay body JSON (prevenir Unexpected end of JSON input)
      let data = null;
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        // Si el content-type anuncia JSON, lo intentamos parsear (con try/catch)
        try {
          data = await response.json();
        } catch (parseErr) {
          console.warn("[Register] Error parseando JSON del body:", parseErr);
          // dejamos data = null y seguimos; manejamos más abajo según response.ok
        }
      } else {
        // No vino JSON; si es OK quizás no devuelvan body; si no OK, creamos mensaje genérico
        console.warn("[Register] Response content-type no es JSON:", contentType);
      }

      console.log("[Register] response.ok =", response.ok, "status =", response.status);

      if (!response.ok) {
        // tratar distintos formatos de error
        let msg = `HTTP ${response.status} ${response.statusText}`;
        if (data) {
          // Preferir message/error de body si existe
          msg = data.message || data.error || JSON.stringify(data);
        }
        setIsError(true);
        setStatusMessage(msg);
        return;
      }

      // Si llegamos acá, fue exitoso
      setIsError(false);
      setStatusMessage((data && data.message) || "Usuario registrado con éxito.");

      // Limpiamos formulario
      setFormData({
        name: "",
        email: "",
        birthdate: "",
        nDni: "",
        password: "",
        confirmPassword: ""
      });

      // Si el backend devolvió un objeto usuario (por ej. con email), hacemos login
      // Tu implementación previa comprobaba data.email; lo mantenemos.
      if (data && data.email) {
        try {
          loginUser && loginUser(data);
          console.log("[Register] Usuario logueado:", data.email || data);
        } catch (loginErr) {
          console.warn("[Register] loginUser lanzó error:", loginErr);
        }
      } else {
        console.warn("[Register] El backend no retornó un objeto 'user' con email.");
      }

      // Cerrar modal si corresponde y redirigir al home
      if (onClose) onClose();
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("[Register] Error en fetch:", error);
      setIsError(true);
      setStatusMessage("Error al enviar la solicitud. Intente más tarde.");
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.birthdate &&
    formData.nDni &&
    formData.password &&
    formData.confirmPassword;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registro</h1>

      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="birthdate">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nDni">Número de DNI:</label>
          <input
            type="text"
            id="nDni"
            name="nDni"
            value={formData.nDni}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
