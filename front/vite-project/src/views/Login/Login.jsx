// src/views/Login/Login.jsx
import React, { useState } from "react";
import styles from "./Login.module.css";
import useUserContext from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useUserContext();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setStatusMessage("Por favor complete todos los campos.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log("📌 DATA desde backend:", data); // 👉 Verificamos qué llega exactamente

      if (!response.ok || !data.user) {
        setStatusMessage(data.error || "Error al iniciar sesión.");
        setIsError(true);
        return;
      }

      // ✅ Login exitoso
      setStatusMessage(data.message || "Login exitoso.");
      setIsError(false);

      console.log("✅ Usuario recibido:", data.user); // 👉 Confirmamos que llega user

      loginUser(data.user); // 👈 Seteamos en contexto
      navigate("/");
    } catch (error) {
      console.error("❌ Error:", error);
      setStatusMessage("Error al conectar con el servidor.");
      setIsError(true);
    }
  };

  const isFormValid = formData.username && formData.password;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      {statusMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {statusMessage}
        </div>
      )}
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
