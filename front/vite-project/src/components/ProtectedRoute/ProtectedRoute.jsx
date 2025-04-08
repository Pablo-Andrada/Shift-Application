// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserContext from "../../hooks/useUserContext";

/**
 * Componente ProtectedRoute
 * Protege rutas privadas: mientras se cargan los datos del usuario, se muestra un spinner;
 * si no hay usuario, redirige a /login, y si existe, renderiza los hijos.
 *
 * @param {object} props - Las props del componente.
 * @param {React.ReactNode} props.children - El contenido a renderizar si el usuario está autenticado.
 * @returns {JSX.Element} El contenido protegido o redirección a /login.
 */
const ProtectedRoute = ({ children }) => {
  // Obtenemos user e isLoading desde el contexto
  const { user, isLoading } = useUserContext();
  const location = useLocation();

  // Si aún se están cargando los datos del usuario, mostramos un indicador de carga (spinner)
  if (isLoading) {
    return <div>Loading...</div>; // Puedes sustituirlo por un componente spinner personalizado
  }

  // Si no hay usuario, redirige a /login y guarda la ruta actual para poder volver después de loguear
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay usuario, renderizamos el contenido protegido
  return children;
};

export default ProtectedRoute;
