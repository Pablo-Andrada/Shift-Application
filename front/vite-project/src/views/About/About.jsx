// src/views/About/About.jsx
import React, { useState, useEffect } from "react";
import styles from "./About.module.css";

/**
 * ImageCarousel
 * Componente que muestra una imagen a la vez y la rota automáticamente.
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.images - Arreglo de URLs de imágenes a mostrar.
 * @param {number} [props.interval=3000] - Intervalo en milisegundos para cambiar la imagen.
 * @returns {JSX.Element} Carrusel de imágenes.
 */
const ImageCarousel = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect que actualiza el índice actual cada 'interval' milisegundos.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    // Se limpia el timer al desmontar el componente.
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
 * Muestra la historia del taller, un carrusel de imágenes y, al final, un mapa que indica la ubicación del taller.
 */
const About = () => {
  // Arreglo de URLs para el carrusel (puedes reemplazarlas por imágenes locales o de otro origen)
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
      
      {/* Sección del mapa que muestra la ubicación del taller */}
      <div className={styles.mapContainer}>
        <h2 className={styles.mapTitle}>Nuestra Ubicación</h2>
        {/* Aquí se utiliza un iframe de Google Maps para mostrar la ubicación */}
        <iframe
          title="Ubicación del Taller"
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2833.4909395454883!2d-63.869778!3d-31.691721999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDQxJzMwLjIiUyA2M8KwNTInMTEuMiJX!5e1!3m2!1ses!2sar!4v1743356024020!5m2!1ses!2sar"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default About;
