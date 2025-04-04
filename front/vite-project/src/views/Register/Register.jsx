// src/views/Register/Register.jsx
import React, { useState } from "react";
import styles from "./Register.module.css";

/**
 * Componente Register
 * Muestra un formulario controlado para el registro de un nuevo usuario.
 * Los datos del formulario se guardan en el estado local, se validan y, al enviarse,
 * se realiza una petición POST al servidor. Se notifica al usuario sobre el resultado.
 */
const Register = () => {
  // Estado del formulario: se inicializa con valores vacíos para cada campo.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    nDni: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  // Estado para almacenar el mensaje de estado (éxito o error) y una bandera para diferenciar.
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  /**
   * handleChange:
   * Actualiza el estado del formulario cuando el usuario escribe en un campo.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit:
   * Se ejecuta al enviar el formulario. Valida que todos los campos estén completos
   * y que las contraseñas coincidan. Luego, realiza una petición POST al servidor.
   * Muestra un mensaje de éxito o error basado en la respuesta.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, birthdate, nDni, username, password, confirmPassword } = formData;

    // Validación: Todos los campos deben estar completos.
    if (!name || !email || !birthdate || !nDni || !username || !password || !confirmPassword) {
      setIsError(true);
      setStatusMessage("Por favor, complete todos los campos.");
      return;
    }

    // Validación: Las contraseñas deben coincidir.
    if (password !== confirmPassword) {
      setIsError(true);
      setStatusMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Realizamos la petición POST al endpoint de registro en el servidor.
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos los datos del formulario (omitimos confirmPassword)
        body: JSON.stringify({ name, email, birthdate, nDni, username, password })
      });
      const data = await response.json();

      if (!response.ok) {
        // Si ocurre un error, se notifica con un mensaje de error.
        setIsError(true);
        setStatusMessage(data.error || "Error al registrar usuario.");
      } else {
        // Si el registro es exitoso, se muestra un mensaje de éxito.
        setIsError(false);
        setStatusMessage(data.message || "Usuario registrado con éxito.");
        // Se limpia el formulario.
        setFormData({
          name: "",
          email: "",
          birthdate: "",
          nDni: "",
          username: "",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
      setStatusMessage("Error al enviar la solicitud. Intente más tarde.");
    }
  };

  // Variable que determina si el formulario es válido: todos los campos completos y contraseñas iguales.
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.birthdate &&
    formData.nDni &&
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registro</h1>
      {/* Muestra el mensaje de estado, si existe */}
      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Grupo de input para el nombre */}
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
        {/* Grupo de input para el email */}
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
        {/* Grupo de input para la fecha de nacimiento */}
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
        {/* Grupo de input para el número de DNI */}
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
        {/* Grupo de input para el nombre de usuario */}
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
        {/* Grupo de input para la contraseña */}
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
        {/* Grupo de input para confirmar la contraseña */}
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
        {/* Botón de envío. Se deshabilita hasta que el formulario sea válido */}
        <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
