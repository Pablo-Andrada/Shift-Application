// src/components/Modal/Modal.jsx
import React from "react";
import styles from "./Modal.module.css";

/**
 * Componente Modal
 * Muestra un modal (ventana emergente) si la prop isOpen es true.
 * onClose se llama para cerrar el modal.
 * El contenido del modal se pasa a través de children.
 */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
