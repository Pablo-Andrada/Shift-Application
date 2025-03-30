// src/views/Contacto/Contacto.jsx
import React, { useState } from "react";
import styles from "./Contact.module.css";

const Contact = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Función para actualizar el estado conforme se escriben los datos
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica para enviar el mensaje (por ejemplo, a tu mail)
    console.log(formData);
    alert("Mensaje enviado. ¡Gracias por contactarnos!");
    // Limpiar el formulario
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contacto</h1>
      
      {/* Formulario para enviar el mensaje */}
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

      {/* Sección de redes sociales */}
      <div className={styles.socialMedia}>
        <h2>Síguenos en redes sociales</h2>
        <ul className={styles.socialList}>
          <li>
            <a href="https://facebook.com/tuempresa" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
          <li>
            <a href="https://twitter.com/tuempresa" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </li>
          <li>
            <a href="https://instagram.com/tuempresa" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/company/tuempresa" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>

      {/* Sección de mapa */}
      <div className={styles.mapContainer}>
        <h2>Ubicación</h2>
        <iframe
          title="Ubicación de la Empresa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086954942827!2d-122.40137768468173!3d37.78823877975626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064e2435bcd%3A0x1fa1b77c4823a9c3!2sGoogle!5e0!3m2!1ses!2s!4v1616635926757!5m2!1ses!2s"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
