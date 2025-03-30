"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Importa cors
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const morgan_1 = __importDefault(require("morgan"));
const server = (0, express_1.default)();
// Usa cors para habilitar solicitudes desde otros orígenes
// Con la configuración por defecto se permiten todos los orígenes,
// o podés restringirlo con opciones, ej: cors({ origin: "http://localhost:5173" })
server.use((0, cors_1.default)());
server.use((0, morgan_1.default)("dev"));
server.use(express_1.default.json());
server.use(indexRouter_1.default);
exports.default = server;
