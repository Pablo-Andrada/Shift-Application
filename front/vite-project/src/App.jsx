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
import CreateAppointment from "./components/CreateAppointment/CreateAppointment"; // 👈 NUEVA IMPORTACIÓN

// Importamos el componente NavBar, que se mostrará en todas las páginas.
import NavBar from "./components/NavBar/NavBar";

// Importamos el componente que protege rutas privadas
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Importamos ToastContainer de react-toastify y sus estilos para mostrar notificaciones globales.
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Componente App
 * Este es el componente principal de la aplicación.
 * Está envuelto en BrowserRouter (definido en main.jsx) para habilitar el enrutamiento.
 * Aquí se definen todas las rutas de la aplicación mediante el componente Routes.
 */
const App = () => {
  return (
    <>
      { /* El NavBar se renderiza en la parte superior y estará presente en todas las rutas. */ }
      <NavBar />

      { /* ToastContainer permite mostrar notificaciones (toasts) de forma global.
           Se configura para aparecer en la esquina superior derecha, con un auto cierre después de 3000ms. */ }
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

      { /* Definición de las rutas de la aplicación.
           Cada Route define un path y el componente que se renderizará cuando la URL coincida.
           Por ejemplo, "/" renderiza el componente Home y "/register" renderiza el componente Register. */ }
      <Routes>
        <Route path="/" element={<Home />} />

        { /* Ruta protegida: Mis Turnos. Solo accesible si el usuario está logueado.
             El componente ProtectedRoute (definido en src/components/ProtectedRoute/ProtectedRoute.jsx)
             se encarga de verificar si hay un usuario en el contexto. */ }
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MisTurnos />
            </ProtectedRoute>
          }
        />

        { /* Ruta protegida: Crear Turno. Solo accesible si el usuario está logueado.
             Utiliza el mismo componente ProtectedRoute que la sección de Mis Turnos. */ }
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
