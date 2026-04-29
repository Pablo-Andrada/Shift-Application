import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home/Home";
import MisTurnos from "./views/Mis Turnos/MisTurnos";
import About from "./views/About/About";
import Contacto from "./views/Contact/Contact";
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";
import Admin from "./views/Admin/Admin";
import CreateAppointment from "./components/CreateAppointment/CreateAppointment";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <>
            <NavBar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick draggable pauseOnHover />
            <Routes>
                <Route path="/" element={<Home />} />

                {/* Rutas de usuario común */}
                <Route path="/appointments" element={<ProtectedRoute><MisTurnos /></ProtectedRoute>} />
                <Route path="/crear-turno" element={<ProtectedRoute><CreateAppointment /></ProtectedRoute>} />

                {/* Ruta exclusiva del admin */}
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

                <Route path="/about" element={<About />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
};

export default App;
