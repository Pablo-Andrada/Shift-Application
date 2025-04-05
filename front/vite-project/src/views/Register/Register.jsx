// src/views/Register/Register.jsx
import React, { useState } from "react";
import styles from "./Register.module.css";

/**
 * Componente Register
 * Este componente muestra un formulario controlado para el registro de un nuevo usuario.
 * Se espera que el backend reciba un objeto con las siguientes propiedades:
 *  - name: string
 *  - email: string
 *  - birthdate: string (en formato ISO, por ejemplo "1988-07-15T00:00:00.000Z")
 *  - nDni: string
 *  - credentialsId: number
 * 
 * El formulario valida que todos los campos estén completos. Además, al enviar, convierte
 * el valor del input de fecha al formato ISO y realiza una petición POST al servidor.
 * Se notifica al usuario sobre el resultado (éxito o error) mediante un mensaje.
 */
const Register = () => {
  // Estado para almacenar los datos del formulario.
  // Solo incluimos los campos que el backend requiere.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    nDni: "",
    credentialsId: ""
  });

  // Estado para almacenar el mensaje de estado (éxito o error).
  const [statusMessage, setStatusMessage] = useState("");
  // Estado para diferenciar entre mensaje de error y éxito.
  const [isError, setIsError] = useState(false);

  /**
   * handleChange:
   * Actualiza el estado del formulario conforme el usuario escribe en cada campo.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit:
   * Se ejecuta al enviar el formulario.
   * Valida que todos los campos estén completos, convierte el valor de birthdate
   * al formato ISO y realiza una petición POST al servidor con los datos del formulario.
   * Se notifica al usuario sobre el resultado del registro (éxito o error).
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, birthdate, nDni, credentialsId } = formData;

    // Validación: Todos los campos deben estar completos.
    if (!name || !email || !birthdate || !nDni || !credentialsId) {
      setIsError(true);
      setStatusMessage("Por favor, complete todos los campos.");
      return;
    }

    try {
      // Realizamos la petición POST al endpoint de registro del backend.
      // NOTA: La URL se ajusta a lo que espera el backend.
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Convertimos la fecha al formato ISO (por ejemplo, "1988-07-15T00:00:00.000Z")
        body: JSON.stringify({
          name,
          email,
          birthdate: new Date(birthdate).toISOString(),
          nDni,
          credentialsId: Number(credentialsId)
        })
      });
      const data = await response.json();

      // Si la respuesta no es exitosa, mostramos un mensaje de error.
      if (!response.ok) {
        setIsError(true);
        setStatusMessage(
          typeof data.error === "object" ? "Error al registrar usuario." : data.error || "Error al registrar usuario."
        );
      } else {
        // Registro exitoso: mostramos un mensaje de éxito y limpiamos el formulario.
        setIsError(false);
        setStatusMessage(data.message || "Usuario registrado con éxito.");
        setFormData({
          name: "",
          email: "",
          birthdate: "",
          nDni: "",
          credentialsId: ""
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
      setStatusMessage("Error al enviar la solicitud. Intente más tarde.");
    }
  };

  // Se valida que todos los campos tengan valor para habilitar el botón de envío.
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.birthdate &&
    formData.nDni &&
    formData.credentialsId;

  return (
    <div className={styles.container}>
      {/* Título de la vista de registro */}
      <h1 className={styles.title}>Registro</h1>

      {/* Mensaje de estado (éxito o error) */}
      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}

      {/* Formulario de registro */}
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
        {/* Grupo de input para el credentialsId */}
        <div className={styles.formGroup}>
          <label htmlFor="credentialsId">ID de Credenciales:</label>
          <input
            type="number"
            id="credentialsId"
            name="credentialsId"
            value={formData.credentialsId}
            onChange={handleChange}
            required
          />
        </div>
        {/* Botón de envío: se deshabilita hasta que el formulario sea válido */}
        <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
