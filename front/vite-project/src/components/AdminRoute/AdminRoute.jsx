import React from "react";
import { Navigate } from "react-router-dom";
import useUserContext from "../../hooks/useUserContext";

const AdminRoute = ({ children }) => {
    const { user, isLoading, isAdmin } = useUserContext();
    if (isLoading) return <div style={{textAlign:"center",padding:"2rem"}}>Cargando...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
};

export default AdminRoute;
