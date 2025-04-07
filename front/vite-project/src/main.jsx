// Importamos React y ReactDOM para renderizar nuestra App
import React from "react";
import ReactDOM from "react-dom/client";

// Importamos BrowserRouter para manejar el enrutamiento de la App
import { BrowserRouter } from "react-router-dom";

// Importamos nuestro componente principal App
import App from "./App.jsx";

// Importamos el Provider del contexto global de usuario
import { UserProvider } from "./context/UserContext.jsx";
// Importamos el Provider del contexto global de appointment
import { AppointmentProvider} from "./context/AppointmentContext.jsx";

// Importamos los estilos globales (opcional, si tenés algún CSS global)
import "./index.css";

// Renderizamos la App dentro del elemento root del HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode ayuda a detectar problemas potenciales (en desarrollo)
  <React.StrictMode>
    {/* BrowserRouter envuelve toda la App para habilitar React Router */}
    <BrowserRouter>
      {/* UserProvider envuelve toda la App para compartir el estado global del usuario */}
      <UserProvider>
        {/* AppointmentProvider envuelve toda la App para compartir el estado global del usuario */}
        <AppointmentProvider>
          {/* Componente principal de la aplicación */}
          <App />
        </AppointmentProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
