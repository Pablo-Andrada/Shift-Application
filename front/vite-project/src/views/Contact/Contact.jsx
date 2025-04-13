// src/views/Contact/Contact.jsx
import React, { useState } from "react";
// Importa los estilos locales con CSS Modules
import styles from "./Contact.module.css";
// Importa el método toast para mostrar notificaciones
import { toast } from "react-toastify";
// Importamos el ícono de WhatsApp de react-icons (asegúrate de tener instalado react-icons)
import { FaWhatsapp } from "react-icons/fa";

const Contacto = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Función que actualiza el estado conforme el usuario escribe en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realiza la petición POST al backend, ajusta la URL si es necesario
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Convierte la respuesta a JSON
      const data = await response.json();

      // Si la respuesta no es exitosa, muestra un toast de error
      if (!response.ok) {
        toast.error(data.error || "Error al enviar el mensaje", {
          position: "top-right",
        });
      } else {
        // Si se envía el mensaje, muestra un toast de éxito
        toast.success(data.message || "Mensaje enviado correctamente", {
          position: "top-right",
        });
        // Limpia el formulario
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error:", error);
      // En caso de error, muestra un toast de error
      toast.error("No se pudo enviar el mensaje. Intenta más tarde.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contacto</h1>
      <h5 className={styles.subtitle}>
        Por cualquier consulta, llámanos al: <span className={styles.phone}>3572529573</span>{" "}
        o vía WhatsApp:
        {/* Enlace que abre WhatsApp para chatear con el número especificado */}
        <a
          href="https://wa.me/3572529573"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappLink}
        >
          <FaWhatsapp className={styles.whatsappIcon} />
        </a>
      </h5>
      <h5 className={styles.subtitle}>
        También podes escribirnos via email:
      </h5>
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
        <button type="submit" className={styles.submitButton}>
          Enviar Mensaje
        </button>
      </form>
      {/* Puedes agregar secciones adicionales para redes sociales o mapa aquí */}
      <h5 className={styles.subtitle}>
        Esperamos tu consulta!
      </h5>
    </div>
  );
};

export default Contacto;
