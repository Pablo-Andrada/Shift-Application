// Importamos el hook de React y el contexto que definimos antes
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

// Creamos un custom hook para facilitar el uso del contexto
// Esto evita tener que importar useContext + UserContext cada vez que lo necesitemos
const useUserContext = () => {
  const context = useContext(UserContext);

  // Validación: si se usa fuera del <UserProvider> lanzamos un error
  if (!context) {
    throw new Error("useUserContext debe usarse dentro de un UserProvider");
  }

  return context;
};

// Exportamos el custom hook para usarlo fácilmente en cualquier componente
export default useUserContext;
