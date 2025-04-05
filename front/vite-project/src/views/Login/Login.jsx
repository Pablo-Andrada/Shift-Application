// src/views/Login/Login.jsx
import React, { useState } from "react";
import styles from "./Login.module.css";

/**
 * Componente Login
 * Muestra un formulario controlado para iniciar sesión.
 * Solo se muestra el botón de envío cuando ambos campos (username y password) están completos.
 */
const Login = () => {
  // Estado para almacenar los datos del formulario (username y password).
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  // Estado para almacenar el mensaje de estado (éxito o error).
  const [statusMessage, setStatusMessage] = useState("");
  // Estado para indicar si el mensaje es de error.
  const [isError, setIsError] = useState(false);

  /**
   * handleChange:
   * Actualiza el estado del formulario cuando el usuario escribe en los inputs.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit:
   * Se ejecuta al enviar el formulario.
   * Realiza una petición POST al endpoint de login del backend con las credenciales.
   * Muestra un mensaje de éxito o error basado en la respuesta del servidor.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    
    // Validación: Verificamos que ambos campos tengan valor.
    if (!username || !password) {
      setStatusMessage("Por favor complete todos los campos.");
      setIsError(true);
      return;
    }
    
    try {
      // Realiza la petición POST al endpoint de login del backend.
      const response = await fetch("http://localhost:3000/credentials/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
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

  // Se valida que ambos campos tengan valor.
  const isFormValid = formData.username && formData.password;

  return (
    <div className={styles.container}>
      {/* Título de la vista de login */}
      <h1 className={styles.title}>Iniciar Sesión</h1>

      {/* Muestra un mensaje de estado si existe */}
      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}

      {/* Formulario controlado para login */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
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
        {/* Solo mostramos el botón si el formulario es válido */}
        {isFormValid ? (
          <button type="submit" className={styles.submitButton}>
            Iniciar Sesión
          </button>
        ) : (
          // Puedes mostrar un mensaje informativo o dejarlo vacío
          <p className={styles.infoMessage}>Complete ambos campos para iniciar sesión.</p>
        )}
      </form>
    </div>
  );
};

export default Login;
