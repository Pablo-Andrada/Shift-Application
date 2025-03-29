// src/views/About/About.jsx
import React, { useState, useEffect } from "react";
import styles from "./About.module.css";

/**
 * ImageCarousel
 * Un componente que muestra una imagen a la vez y la rota automáticamente
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.images - Arreglo de URLs de imágenes a mostrar
 * @param {number} [props.interval=3000] - Intervalo en milisegundos para cambiar la imagen
 * @returns {JSX.Element} El carrusel de imágenes
 */
const ImageCarousel = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto que actualiza la imagen actual cada 'interval' milisegundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className={styles.carouselContainer}>
      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        className={styles.carouselImage}
      />
    </div>
  );
};

/**
 * Componente About
 * Muestra la historia del taller y utiliza un carrusel de imágenes para ilustrar la experiencia
 */
const About = () => {
  // Arreglo de URLs para el carrusel; podes reemplazar estas URLs con las imágenes que prefieras o locales.
  const carouselImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb5jstQYnIX8hBGROFSPWW34LGWIIKxDodXqGuOJNtqUujKfMv_794lQeiIKVojHXkaG0&usqp=CAU",
    "https://www.clarin.com/2018/01/12/Sy6gg3LNz_312x240__1.jpg",
    "https://www.cronistalascolonias.com.ar/wp-content/uploads/2020/01/7FD5E15F-7965-49B1-8075-7AD59985797D-750x500.jpeg"
  ];

  return (
    <div className={styles.container}>
      {/* Título principal */}
      <h1 className={styles.title}>Taller Mecánica Avanzada</h1>
      
      {/* Carrusel de imágenes */}
      <div className={styles.carouselWrapper}>
        <ImageCarousel images={carouselImages} interval={4000} />
      </div>
      
      {/* Contenido textual que narra la historia del taller */}
      <div className={styles.content}>
        <p>
          Fundado en 1978 por el legendario Roberto "El Motor" Martínez, Taller
          Mecánica Avanzada comenzó como un pequeño taller en las afueras de
          Buenos Aires. Con una visión única y un amor profundo por los motores y
          la innovación, Roberto se propuso revolucionar la forma en que se
          reparaban y mantenían los vehículos.
        </p>
        <p>
          Desde sus inicios, nuestro taller se destacó por la pasión por la
          mecánica, el compromiso con la calidad y la integridad en cada trabajo.
          La filosofía que mueve a la empresa es simple: “Cada motor tiene su
          alma, y cada reparación es un acto de arte”. Con el tiempo, Taller
          Mecánica Avanzada se convirtió en un referente en el sector automotriz,
          ofreciendo soluciones innovadoras y un servicio excepcional a sus
          clientes.
        </p>
        <p>
          Nuestro equipo de expertos, formado a lo largo de décadas de experiencia,
          continúa impulsando la excelencia en cada servicio. Nos enorgullece
          combinar la tradición con la tecnología de punta, logrando resultados
          que superan las expectativas y asegurando la longevidad de cada motor que
          pasa por nuestras manos.
        </p>
        <p>
          Hoy, Taller Mecánica Avanzada es sinónimo de confianza, innovación y
          compromiso. Seguimos trabajando con la misma pasión del fundador,
          impulsados por el deseo de preservar la historia y la evolución del
          mundo automotriz, mientras miramos hacia el futuro con ideas frescas y
          proyectos que transforman el sector.
        </p>
      </div>
    </div>
  );
};

export default About;
