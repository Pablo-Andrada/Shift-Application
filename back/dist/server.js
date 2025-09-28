"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Importamos el middleware CORS
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const morgan_1 = __importDefault(require("morgan"));
const server = (0, express_1.default)();
// Configuramos CORS para permitir solicitudes desde otros orígenes.
// Con la configuración por defecto, se permiten todas las solicitudes, lo cual es adecuado en desarrollo.
// Si necesitás restringir los orígenes, podés pasar opciones (por ejemplo: { origin: "http://localhost:5173" }).
server.use((0, cors_1.default)());
// Middleware para registrar las solicitudes en consola (útil en desarrollo)
server.use((0, morgan_1.default)("dev"));
// Middleware para parsear solicitudes JSON
server.use(express_1.default.json());
// Montamos todas las rutas definidas en indexRouter
server.use(indexRouter_1.default);
exports.default = server;
