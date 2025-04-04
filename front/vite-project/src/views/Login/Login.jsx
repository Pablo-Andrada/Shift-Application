// src/views/Login/Login.jsx
import React, { useState } from "react";
import styles from "./Login.module.css";

/**
 * Componente Login
 * Muestra un formulario controlado para iniciar sesión, validando que todos los campos estén completos.
 * Al enviar, realiza una petición POST al servidor para el login del usuario y muestra un mensaje de éxito o error.
 */
const Login = () => {
  // Estado para almacenar email y contraseña del usuario.
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Estado para almacenar el mensaje de estado (éxito o error).
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  /**
   * handleChange: Actualiza el estado del formulario cuando el usuario escribe.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit: Se ejecuta al enviar el formulario.
   * Valida que todos los campos estén completos y realiza una petición POST al servidor.
   * Muestra un mensaje de éxito o error basado en la respuesta del servidor.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    // Validación: Verificamos que ambos campos estén completos.
    if (!email || !password) {
      setStatusMessage("Por favor complete todos los campos.");
      setIsError(true);
      return;
    }
    
    try {
      // Realiza la petición POST al endpoint de login del backend.
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Si la respuesta del servidor no es exitosa, mostramos el mensaje de error.
      if (!response.ok) {
        setStatusMessage(data.error || "Error al iniciar sesión.");
        setIsError(true);
      } else {
        // Login exitoso: mostramos el mensaje de éxito.
        setStatusMessage(data.message || "Login exitoso.");
        setIsError(false);
        // Opcional: aquí podrías redirigir al usuario o almacenar tokens.
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Error al conectar con el servidor.");
      setIsError(true);
    }
  };

  // Determinamos si el formulario es válido (ambos campos completos).
  const isFormValid = formData.email && formData.password;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar Sesión</h1>

      {/* Muestra un mensaje de estado si existe */}
      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
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
        <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
