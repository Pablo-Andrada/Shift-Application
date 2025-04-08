// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Creamos el contexto
export const UserContext = createContext();

/**
 * Componente UserProvider
 * Envuelve la aplicación y provee el contexto de usuario con los estados:
 * - user: los datos del usuario logueado.
 * - isLoading: indica si se están cargando los datos del usuario (por ejemplo, desde localStorage).
 * Además, proporciona las funciones loginUser y logoutUser para manipular el estado.
 */
export const UserProvider = ({ children }) => {
  // Estado para almacenar los datos del usuario logueado (inicialmente null)
  const [user, setUser] = useState(null);
  // Estado para indicar si se están cargando los datos del usuario
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para intentar recuperar el usuario desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Se terminó de cargar (independientemente de haber encontrado o no un usuario)
  }, []);

  /**
   * loginUser:
   * Guarda el usuario en el estado y en localStorage para persistencia.
   */
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * logoutUser:
   * Limpia el usuario del estado y remueve la información del almacenamiento local.
   */
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // El value del contexto que se comparte con los componentes hijos
  const value = {
    user,
    loginUser,
    logoutUser,
    isLoading, // Indica si se han cargado los datos del usuario
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
