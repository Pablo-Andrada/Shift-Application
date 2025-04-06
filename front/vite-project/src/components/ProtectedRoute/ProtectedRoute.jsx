// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import  useUserContext  from "../../hooks/useUserContext";

/**
 * Componente ProtectedRoute
 * Este componente actúa como una barrera de protección para rutas privadas.
 * Si el usuario no está logueado, se lo redirige a la página de Login.
 * Si el usuario está logueado, se permite el acceso al contenido.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext();

  // Si no hay usuario logueado, redirige a la ruta de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario logueado, muestra el contenido protegido
  return children;
};

export default ProtectedRoute;
