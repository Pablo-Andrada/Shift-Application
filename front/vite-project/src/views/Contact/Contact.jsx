// src/views/Contacto/Contacto.jsx
import React, { useState } from "react";
import styles from "./Contact.module.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Maneja el cambio de cada input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajusta la URL a la de tu backend
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el mensaje.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contacto</h1>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
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
          <label htmlFor="message">Mensaje:</label>
          <textarea 
            id="message" 
            name="message" 
            rows="5" 
            value={formData.message} 
            onChange={handleChange} 
            required
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>Enviar Mensaje</button>
      </form>
      {/* Puedes mantener aquí las secciones de redes sociales y mapa, si las tienes */}
    </div>
  );
};

export default Contacto;
