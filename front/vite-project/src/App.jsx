// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos las vistas
import Home from "./views/Home/Home";
import MisTurnos from "./views/Mis Turnos/MisTurnos";
import About from "./views/About/About";
import Contacto from "./views/Contact/Contact";
import NavBar from "./components/NavBar/NavBar";

// Importa ToastContainer y los estilos de react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      {/* La NavBar se muestra en todas las rutas */}
      <NavBar />
      {/* ToastContainer se coloca aquí para que los toasts aparezcan globalmente */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<MisTurnos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
