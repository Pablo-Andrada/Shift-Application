// src/views/Register/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para redireccionar
import useUserContext from "../../hooks/useUserContext"; // Hook del contexto de usuario
import styles from "./Register.module.css";

/**
 * Componente Register
 * Muestra un formulario controlado para el registro de un nuevo usuario.
 * Se espera que el backend reciba un objeto con las siguientes propiedades:
 *  - name: string
 *  - email: string
 *  - birthdate: string (en formato ISO, por ejemplo "1988-07-15T00:00:00.000Z")
 *  - nDni: string
 *  - password: string
 *
 * Si el registro es exitoso, se loguea automáticamente al usuario (guardando sus datos en el contexto),
 * se muestra un mensaje de éxito y, después de 2 segundos, se redirecciona al Home.
 * Si se recibe la prop onClose (usada en un modal), se cierra el modal.
 */
const Register = ({ onClose }) => {
  // Estado para almacenar los datos del formulario, sin incluir "credentialsId"
  // y agregando "password" y "confirmPassword".
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    nDni: "",
    password: "",
    confirmPassword: ""
  });

  // Estados para manejar el mensaje de estado (éxito o error)
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Obtenemos el hook de redireccionamiento y la función loginUser desde el contexto
  const navigate = useNavigate();
  const { loginUser } = useUserContext();

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
   * Valida que todos los campos estén completos y que la contraseña y su confirmación coincidan.
   * Convierte el valor del input de fecha al formato ISO y realiza una petición POST al servidor con los datos.
   * Si el registro es exitoso, se loguea automáticamente al usuario, se muestra un mensaje de éxito,
   * se limpia el formulario, se cierra el modal (si se pasó onClose) y, después de 2 segundos, se redirecciona al Home.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, birthdate, nDni, password, confirmPassword } = formData;

    // Validación: Todos los campos deben estar completos.
    if (!name || !email || !birthdate || !nDni || !password || !confirmPassword) {
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
      // Realizamos la petición POST al endpoint de registro del backend.
      const response = await fetch("https://shift-backend-rvqt.onrender.com/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Convertimos la fecha al formato ISO (por ejemplo, "1988-07-15T00:00:00.000Z")
        body: JSON.stringify({
          name,
          email,
          birthdate: new Date(birthdate).toISOString(),
          nDni,
          password
        })
      });
      const data = await response.json();
      console.log("Respuesta del backend:", data);

      // Si la respuesta no es exitosa, mostramos un mensaje de error.
      if (!response.ok) {
        setIsError(true);
        setStatusMessage(
          typeof data.error === "object"
            ? "Error al registrar usuario."
            : data.error || "Error al registrar usuario."
        );
      } else {
        // Registro exitoso: mostramos el mensaje de éxito y limpiamos el formulario.
        setIsError(false);
        setStatusMessage(data.message || "Usuario registrado con éxito.");
        setFormData({
          name: "",
          email: "",
          birthdate: "",
          nDni: "",
          password: "",
          confirmPassword: ""
        });
        
        // Logueamos automáticamente al usuario si el backend devuelve los datos directamente.
        // En este caso, comprobamos que data tenga la propiedad "email" (o cualquier otro campo representativo del usuario).
        if (data && data.email) {
          loginUser(data); // Usamos todo el objeto directamente
          console.log("Usuario logueado:", data);
        } else {
          console.warn("El backend no retornó un objeto 'user'.");
        }

        // Si se pasó onClose (por ejemplo, si el componente se muestra en un modal), lo llamamos para cerrarlo.
        if (onClose) onClose();

        // Redireccionamos automáticamente al Home después de 2 segundos.
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
      setStatusMessage("Error al enviar la solicitud. Intente más tarde.");
    }
  };

  // Validamos que todos los campos tengan valor para habilitar el botón de envío.
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.birthdate &&
    formData.nDni &&
    formData.password &&
    formData.confirmPassword;

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
        {/* Botón de envío: se deshabilita hasta que el formulario sea válido */}
        <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
