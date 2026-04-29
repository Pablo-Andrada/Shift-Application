import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserContext from "../../hooks/useUserContext";

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useUserContext();
    const location = useLocation();
    if (isLoading) return <div style={{textAlign:"center",padding:"2rem"}}>Cargando...</div>;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    return children;
};

export default ProtectedRoute;
