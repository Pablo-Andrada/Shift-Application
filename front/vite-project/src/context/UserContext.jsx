import React, { createContext, useState, useEffect } from "react";

// Creamos el contexto
export const UserContext = createContext();

// Este componente envuelve toda la aplicación para que el contexto esté disponible en cualquier componente hijo
export const UserProvider = ({ children }) => {
  // Estado para almacenar los datos del usuario logueado
  const [user, setUser] = useState(null);

  // useEffect para intentar recuperar el usuario desde localStorage cuando se monta la app
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Recuperamos del almacenamiento local
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Si hay un usuario guardado, lo seteamos
    }
  }, []);

  // Función para iniciar sesión y guardar el usuario tanto en estado como en localStorage
  const loginUser = (userData) => {
    setUser(userData); // Guardamos el usuario en el estado
    localStorage.setItem("user", JSON.stringify(userData)); // También en localStorage para persistencia
  };

  // Función para cerrar sesión y limpiar el estado y el almacenamiento
  const logoutUser = () => {
    setUser(null); // Limpiamos el estado
    localStorage.removeItem("user"); // Quitamos del almacenamiento local
  };

  // El value del contexto contiene todo lo que otros componentes pueden usar
  const value = {
    user,
    loginUser,
    logoutUser,
    isAuthenticated: !!user, // Devuelve true si hay un usuario logueado
  };

  // Retornamos el proveedor con el valor que queremos compartir
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
