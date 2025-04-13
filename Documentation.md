<!-- README.md -->

# Shift‑Application

**Shift‑Application** es una plataforma full‑stack para gestionar turnos en un taller mecánico. Permite a los clientes registrarse, iniciar sesión, agendar y cancelar turnos, y enviar consultas al taller.

---

## 🔍 Características

1. **Registro de Usuarios**

   - Formulario con nombre, email, fecha de nacimiento, DNI y contraseña.
   - Guarda credenciales y perfil en PostgreSQL.

2. **Login & Sesión**

   - Autenticación por email y contraseña.
   - Persistencia de sesión en `localStorage` y Context API.

3. **Home**

   - Saludo personalizado.
   - Widgets:
     - Próximo turno activo.
     - Historial rápido (últimos 3 turnos).
     - Calendario interactivo con indicador de días con turnos.
   - Botones de “Iniciar Sesión” y “Registrarse” (si no hay sesión).

4. **Gestión de Turnos**

   - **Crear Turno**: fecha, hora y comentarios opcionales.
   - **Listar Turnos**: filtrar por estado (activos, cancelados).
   - **Cancelar Turno**: cambia estado y notifica al usuario.

5. **Rutas Protegidas**

   - `/appointments` y `/crear-turno` solo accesibles con sesión activa.

6. **Contacto**

   - Formulario de consulta (nombre, email, mensaje).
   - Envío de correo al taller y notificaciones con `react-toastify`.

7. **About**

   - Carrusel de imágenes.
   - Mapa embebido de Google Maps con ubicación del taller.

8. **Emails Automáticos**
   - Confirmación al crear turno.
   - Aviso al cancelar turno.
   - Recordatorios 24 h antes (cron job).

---

## 🛠 Tecnologías

- **Backend**

  - Node.js + Express
  - TypeScript
  - TypeORM + PostgreSQL
  - Nodemailer (Gmail)
  - Cron jobs (node-cron)

- **Frontend**
  - React + Vite
  - React Router
  - CSS Modules
  - Context API (User & Appointment)
  - react-calendar
  - react-toastify

---

## 🚀 Instalación y Ejecución

1. Clona el repositorio

   ```bash
   git clone https://github.com/tu-usuario/shift-application.git

   ```

2. Backend  
   cd shift-application/back
   npm install

# Crear archivo .env con:

# EMAIL_USER, EMAIL_PASSWORD, RECEIVER_EMAIL, PORT, DATABASE_URL, etc.

npm start

El servidor quedará escuchando en http://localhost:3000

3. Front  
   cd shift-application/front
   npm install
   npm run dev

Abre http://localhost:5173 (o el puerto que muestre Vite).

Estructura de carpetas:
shift-application/
├─ back/ # Backend (Express + TypeORM)
│ ├─ src/
│ │ ├─ config/ # DataSource, variables de entorno
│ │ ├─ entities/ # User, Credential, Appointment
│ │ ├─ dtos/ # Data Transfer Objects
│ │ ├─ services/ # Lógica de negocio y acceso a BD
│ │ ├─ controllers/ # Handlers de rutas
│ │ ├─ routes/ # Definición de endpoints
│ │ ├─ utils/ # Cron jobs (recordatorios)
│ │ ├─ emailService.ts # Plantillas y envío de correos
│ │ ├─ server.ts # Configuración de Express
│ │ └─ index.ts # Inicialización de DB y servidor
│ └─ package.json
│
└─ front/ # Frontend (React + Vite)
├─ src/
│ ├─ components/ # Componentes reutilizables (Modal, NavBar, Cards…)
│ ├─ views/ # Páginas (Home, Login, Register, MisTurnos, About, Contact)
│ ├─ context/ # Context API (UserContext, AppointmentContext)
│ ├─ hooks/ # Custom hooks para contextos
│ ├─ App.jsx # Rutas y layout principal
│ ├─ main.jsx # Punto de entrada (ReactDOM)
│ └─ index.css # Estilos globales
└─ package.json

⚙ Uso Básico
-Registro

      Navega a “Registrarse” y completa el formulario.

      Al enviar, se crea tu perfil y sesión.

-Login

      Ve a “Iniciar Sesión” e ingresa tu email y contraseña.

      Al autenticarte, accedes a tus turnos.

-Agendar Turno

      Desde “Mis Turnos” haz clic en “+ Nuevo Turno”.

      Selecciona fecha, hora y agrega un comentario opcional.

-Cancelar Turno

      En la lista de turnos, pulsa “Cancelar turno” en la tarjeta correspondiente.

-Contacto

      Completa el formulario en “Contacto” para enviar tu consulta.

-About

      Explora la historia del taller, carrusel de fotos y mapa de ubicación.
