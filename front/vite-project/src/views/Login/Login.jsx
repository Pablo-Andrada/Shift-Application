// src/views/Login/Login.jsx
import React, { useState } from "react";
import styles from "./Login.module.css";
import useUserContext from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";

/**
 * Componente Login
 * Muestra un formulario controlado para iniciar sesión.
 * Si el login es exitoso, guarda el usuario en el contexto global, redirecciona a la página principal
 * y cierra automáticamente el modal (si se pasa la prop onClose).
 */
const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const { loginUser } = useUserContext();

  // Estado para almacenar los datos del formulario (username y password)
  const [formData, setFormData] = useState({ username: "", password: "" });
  // Estado para almacenar el mensaje de estado (éxito o error)
  const [statusMessage, setStatusMessage] = useState("");
  // Estado para indicar si el mensaje es de error
  const [isError, setIsError] = useState(false);

  /**
   * handleChange: Actualiza el estado del formulario cada vez que el usuario escribe en un input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento del input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit: Se ejecuta al enviar el formulario.
   * Realiza una petición POST al endpoint de login del backend con las credenciales ingresadas.
   * Si el login es exitoso, guarda el usuario en el contexto global, redirecciona y cierra el modal.
   * @param {React.FormEvent<HTMLFormElement>} e - El evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Validamos que ambos campos estén completos
    if (!username || !password) {
      setStatusMessage("Por favor complete todos los campos.");
      setIsError(true);
      return;
    }

    try {
      // Realizamos la petición POST al endpoint de login (asegúrate de usar la URL correcta)
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      // Convertimos la respuesta a JSON
      const data = await response.json();
      console.log("📌 DATA desde backend:", data);

      if (!response.ok || !data.user) {
        setStatusMessage(data.error || "Error al iniciar sesión.");
        setIsError(true);
      } else {
        setStatusMessage(data.message || "Login exitoso.");
        setIsError(false);

        // Guardamos el usuario en el contexto global
        loginUser(data.user);

        // Llamamos a la función onClose (si se pasó) para cerrar el modal
        if (onClose) onClose();

        // Redireccionamos al home
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Error al conectar con el servidor.");
      setIsError(true);
    }
  };

  // Validamos que ambos campos tengan valor para habilitar el botón
  const isFormValid = formData.username && formData.password;

  return (
    <div className={styles.container}>
      {/* Título de la vista de login */}
      <h1 className={styles.title}>Iniciar Sesión</h1>

      {/* Si existe un mensaje de estado, se muestra en un div */}
      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}

      {/* Formulario controlado para login */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">email:</label>
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
        {isFormValid ? (
          <button type="submit" className={styles.submitButton}>
            Iniciar Sesión
          </button>
        ) : (
          <p className={styles.infoMessage}>
            Complete ambos campos para iniciar sesión.
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
