// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Importamos las vistas (páginas) que componen nuestra aplicación.
import Home from "./views/Home/Home";
import MisTurnos from "./views/Mis Turnos/MisTurnos";
import About from "./views/About/About";
import Contacto from "./views/Contact/Contact";
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";
import CreateAppointment from "./components/CreateAppointment/CreateAppointment"; // Componente para crear turnos

// Importamos el componente NavBar, que se muestra en todas las páginas.
import NavBar from "./components/NavBar/NavBar";

// Importamos el componente ProtectedRoute para proteger rutas privadas (que requieren autenticación).
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Importamos ToastContainer de react-toastify para mostrar notificaciones globales junto a sus estilos.
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Componente App
 * 
 * Envuelve la aplicación con las rutas de React Router. Se establece una estructura de rutas:
 * - La ruta "/" muestra la vista Home.
 * - La ruta "/appointments" está protegida y muestra la vista MisTurnos (solo accesible si el usuario está logueado).
 * - La ruta "/crear-turno" también está protegida y muestra el formulario para crear un turno.
 * - Otras rutas (About, Contacto, Register, Login) se muestran de forma pública.
 */
const App = () => {
  return (
    <>
      { /* La NavBar se muestra en la parte superior y estará presente en todas las rutas. */ }
      <NavBar />

      { /* ToastContainer para notificaciones globales. */ }
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

      { /* Definición de las rutas de la aplicación. */ }
      <Routes>
        <Route path="/" element={<Home />} />

        { /* Ruta protegida: Mis Turnos. Solo accesible si el usuario está autenticado. */ }
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MisTurnos />
            </ProtectedRoute>
          }
        />

        { /* Ruta protegida: Crear Turno. Solo accesible si el usuario está autenticado. */ }
        <Route
          path="/crear-turno"
          element={
            <ProtectedRoute>
              <CreateAppointment />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
