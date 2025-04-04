// src/server.ts
import express from "express";
import cors from "cors"; // Importamos el middleware CORS
import router from "./routes/indexRouter";
import morgan from "morgan";

const server = express();

// Configuramos CORS para permitir solicitudes desde otros orígenes.
// Con la configuración por defecto, se permiten todas las solicitudes, lo cual es adecuado en desarrollo.
// Si necesitás restringir los orígenes, podés pasar opciones (por ejemplo: { origin: "http://localhost:5173" }).
server.use(cors());

// Middleware para registrar las solicitudes en consola (útil en desarrollo)
server.use(morgan("dev"));

// Middleware para parsear solicitudes JSON
server.use(express.json());

// Montamos todas las rutas definidas en indexRouter
server.use(router);

export default server;
