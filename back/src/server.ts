// server.ts
import express from "express";
import cors from "cors"; // Importa cors
import router from "./routes/indexRouter";
import morgan from "morgan";

const server = express();

// Usa cors para habilitar solicitudes desde otros orígenes
// Con la configuración por defecto se permiten todos los orígenes,
// o podés restringirlo con opciones, ej: cors({ origin: "http://localhost:5173" })
server.use(cors());

server.use(morgan("dev"));
server.use(express.json());
server.use(router);

export default server;
