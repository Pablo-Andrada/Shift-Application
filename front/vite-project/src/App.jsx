// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos las vistas existentes
import Home from "./views/Home/Home";
import MisTurnos from "./views/Mis Turnos/MisTurnos";
import About from "./views/About/About";
import Contacto from "./views/Contact/Contact";
import NavBar from "./components/NavBar/NavBar";

// Importamos las vistas nuevas (Register y Login) para renderizarlas temporalmente
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";

// Importa ToastContainer y los estilos de react-toastify para notificaciones
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      {/* La NavBar se muestra en todas las rutas */}
      <NavBar />
      
      {/* ToastContainer se coloca para mostrar notificaciones globales */}
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
        {/* Rutas principales */}
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<MisTurnos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        {/* Rutas temporales para Register y Login */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
