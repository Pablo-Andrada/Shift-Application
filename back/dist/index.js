"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTANTE: Importamos el módulo de cron jobs para que, al iniciar el servidor, 
// se cargue y se programen las tareas automáticas (como el envío de recordatorios de turnos)
// Esto es esencial para la automatización sin necesidad de modificar las rutas o controladores existentes.
require("./utils/cronJobs");
// Importamos el servidor configurado
const server_1 = __importDefault(require("./server"));
// Importamos el puerto definido en las variables de entorno
const envs_1 = require("./config/envs");
// Importamos la conexión de la base de datos (DataSource) para inicializarla
const data_source_1 = require("./config/data-source");
console.log('USING DATABASE_URL =', process.env.DATABASE_URL);
// Inicializamos la conexión a la base de datos
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Conexion a la base de datos realizada con éxito");
    // Iniciamos el servidor Express en el puerto configurado
    server_1.default.listen(envs_1.PORT, () => {
        console.log(`Server listening on port ${envs_1.PORT}`);
    });
})
    .catch((err) => {
    // En caso de error al conectar a la base de datos, lo mostramos en consola
    console.error("Error al conectar a la base de datos:", err);
});
