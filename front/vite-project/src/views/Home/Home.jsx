// src/views/Home/Home.jsx
import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* NavBar arriba */}

      
      {/* Encabezado o contenido principal */}
      <h2 className={styles.title}>
        Taller Automotriz: Mecánica avanzada al instante.
      </h2>
    </div>
  );
}

export default Home;


// import NavBar from "../../components/NavBar/NavBar";

// const Home = () => {
//     return (
//         <>
//             <h1>Taller Automotriz: Mecánica avanzada al instante.</h1>
//             <NavBar/>
//         </>
//     )
// };

// export default Home;