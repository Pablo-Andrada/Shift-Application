// src/views/Login/Login.jsx
import React, { useState } from "react";
import styles from "./Login.module.css";
import useUserContext from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
/**
 * Componente Login
 * Muestra un formulario de inicio de sesión.
 * Si el login es exitoso, guarda el usuario en el contexto global,
 * cierra el modal (si se pasa la prop onClose) y redirecciona al Home.
 */
const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const { loginUser } = useUserContext();

  // Estado para almacenar los datos del formulario
  // Ahora usamos "email" en lugar de "username" para coincidir con el backend
  const [formData, setFormData] = useState({ email: "", password: "" });
  // Estado para almacenar mensajes de estado (éxito o error)
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Log para verificar que el componente se cargó
  console.log("Login component loaded");

  /**
   * handleChange:
   * Actualiza el estado del formulario conforme el usuario escribe.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio en el input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(`Campo ${e.target.name} actualizado:`, e.target.value);
  };

  /**
   * handleSubmit:
   * Envía la petición de inicio de sesión al backend y maneja la respuesta.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    console.log("Handle submit triggered con:", { email, password });

    // Validación básica: ambos campos deben estar completos.
    if (!email || !password) {
      setStatusMessage("Por favor complete todos los campos.");
      setIsError(true);
      return;
    }
    
    try {
      console.log("Enviando solicitud de login al backend...");
      const response = await fetch(`${API}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // Convertimos la respuesta a JSON
      const data = await response.json();
      console.log("Respuesta del backend:", data);

      // Si la respuesta no es ok o no contiene el objeto usuario, mostramos error
      if (!response.ok || !data.user) {
        // Usamos data.message que devuelve el backend
        setStatusMessage(data.message || "Error al iniciar sesión.");
        setIsError(true);
        console.error("Error en la respuesta de login:", data.message);
      } else {
        setStatusMessage(data.message || "Login exitoso.");
        setIsError(false);
        console.log("Usuario logueado correctamente:", data.user);
        // Guardamos el usuario en el contexto global
        loginUser(data.user);
        // Si se pasó onClose (por ejemplo, si se está usando dentro de un modal), lo cerramos
        if (onClose) onClose();
        // Redireccionamos al Home
        navigate("/");
      }
    } catch (error) {
      console.error("Error en la petición de login:", error);
      setStatusMessage("Error al conectar con el servidor.");
      setIsError(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
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
        <button type="submit" className={styles.submitButton}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
