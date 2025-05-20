# Shift Application

## English

## Page already in production:

https://shift-application-1iwg.vercel.app

### Overview

Shift Application is a full-stack scheduling platform for managing appointments (turnos). It provides:

- **User registration & login** with secure authentication.
- **Appointment management**: create, view, cancel, and delete appointments.
- **Email notifications**: confirmation and cancellation emails.
- **Role-based access**: protected routes ensure only authenticated users can manage their own appointments.

### Features

- **User Authentication**: Register and log in with email and password. Passwords are securely hashed.
- **Appointment Scheduling**: Users can schedule new appointments by selecting date, time, and adding optional comments.
- **Appointment Listing**: View all your appointments, filter by status (active, cancelled).
- **Appointment Cancellation**: Cancel an existing appointment; status is updated and email notification sent.
- **Appointment Deletion**: Permanently delete appointments via a delete (✖) button in the UI.
- **Responsive UI**: Built with React and CSS Modules for a clean, responsive interface.
- **API Documentation**: RESTful API built with Express and TypeORM.

### Tech Stack

- **Frontend**: React, React Router, React Context, CSS Modules, React-Toastify
- **Backend**: Node.js, Express, TypeScript, TypeORM, PostgreSQL (or your DB of choice)
- **Email Service**: Nodemailer (or external SMTP)
- **Dev Tools**: Vite, ESLint, Prettier

### Getting Started

#### Prerequisites

- Node.js v14+
- npm or yarn
- PostgreSQL (or configured DB)

#### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/shift-application.git
cd shift-application

# Install backend dependencies
cd back
npm install

# Create .env file in back/ with your DB and SMTP credentials
# Example .env:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=secret
# DB_NAME=shift_db
# SMTP_HOST=smtp.example.com
# SMTP_USER=user@example.com
# SMTP_PASS=password

# Run database migrations (if any)
npm run typeorm migration:run

# Start backend server
npm run dev

# In a new terminal, install frontend dependencies
cd ../front
npm install

# Start frontend dev server
npm run dev
```

### Usage

1. Navigate to `https://shift-application-1iwg.vercel.app/`.
2. Register a new account or log in.
3. Access **Mis Turnos** to view, filter, and manage your appointments.
4. Click **✖** on an appointment card to permanently delete it.
5. Use **+ Nuevo Turno** to open the modal and schedule a new appointment.

### API Endpoints

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | `/appointments`              | List all appointments          |
| GET    | `/appointments/:id`          | Get appointment by ID          |
| POST   | `/appointments/schedule`     | Create new appointment         |
| PUT    | `/appointments/cancel/:id`   | Cancel appointment             |
| DELETE | `/appointments/:id`          | Delete appointment permanently |
| GET    | `/appointments/user/:userId` | Get appointments by user ID    |

### Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m "Add xyz feature"`)
4. Push to the branch (`git push origin feature/xyz`)
5. Open a Pull Request

### License

This project is licensed under the MIT License.

---

## Español

## Pagina lista en producción:

https://shift-application-1iwg.vercel.app

### Descripción

Shift Application es una plataforma de programación de turnos de pila completa. Ofrece:

- **Registro e inicio de sesión de usuarios** con autenticación segura.
- **Gestión de turnos**: crear, ver, cancelar y eliminar turnos.
- **Notificaciones por correo**: correos de confirmación y cancelación.
- **Acceso protegido**: rutas que requieren autenticación.

### Funcionalidades

- **Autenticación de usuarios**: Registro e inicio de sesión con email y contraseña.
- **Programación de turnos**: Selección de fecha, hora y comentarios opcionales.
- **Listado de turnos**: Ver todos tus turnos y filtrar por estado.
- **Cancelación de turnos**: Cancelar un turno existente y enviar notificación por correo.
- **Eliminación de turnos**: Botón ✖ para eliminar permanentemente un turno.
- **Interfaz responsiva**: React y CSS Modules.
- **API REST**: Express y TypeORM.

### Tecnologías

- **Frontend**: React, React Router, React Context, CSS Modules, React-Toastify
- **Backend**: Node.js, Express, TypeScript, TypeORM, PostgreSQL
- **Correo**: Nodemailer
- **Herramientas**: Vite, ESLint, Prettier

### Cómo Empezar

#### Requisitos

- Node.js v14+
- npm o yarn
- PostgreSQL (o tu base de datos preferida)

#### Instalación

```bash
# Clona el repositorio
git clone https://github.com/yourusername/shift-application.git
cd shift-application

# Backend\ ncd back
npm install
# Crear .env con credenciales
npm run typeorm migration:run
npm run dev

# Frontend
cd ../front
npm install
npm run dev
```

### Uso

1. Abre `https://shift-application-1iwg.vercel.app/`.
2. Regístrate o inicia sesión.
3. En **Mis Turnos**, gestiona tus turnos.
4. Haz clic en **✖** para eliminar un turno.
5. Usa **+ Nuevo Turno** para agendar uno nuevo.

### Endpoints de la API

| Método | Endpoint                     | Descripción                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/appointments`              | Listar todos los turnos          |
| GET    | `/appointments/:id`          | Obtener turno por ID             |
| POST   | `/appointments/schedule`     | Crear un nuevo turno             |
| PUT    | `/appointments/cancel/:id`   | Cancelar un turno                |
| DELETE | `/appointments/:id`          | Eliminar turno permanentemente   |
| GET    | `/appointments/user/:userId` | Obtener turnos por ID de usuario |

### Contribuir

1. Haz fork
2. Crea una rama (`git checkout -b feature/xyz`)
3. Commit (`git commit -m "Add xyz feature"`)
4. Push (`git push origin feature/xyz`)
5. Abre un Pull Request

### Licencia

Licenciado bajo MIT License.
