// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos las vistas
import Home from "./views/Home/Home";
import MisTurnos from "./views/Mis Turnos/MisTurnos";
import About from "./views/About/About";        // Asegurate de crear la vista About.jsx
import Contacto from "./views/Contact/Contact";  // Asegurate de crear la vista Contacto.jsx
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <BrowserRouter>
      {/* La NavBar se muestra en todas las rutas */}
      <NavBar />
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
