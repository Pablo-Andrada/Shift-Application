// src/index.ts

// IMPORTANTE: Importamos el módulo de cron jobs para que, al iniciar el servidor, 
// se cargue y se programen las tareas automáticas (como el envío de recordatorios de turnos)
// Esto es esencial para la automatización sin necesidad de modificar las rutas o controladores existentes.
import "../src/utils/cronJobs";

// Importamos el servidor configurado
import server from "./server";

// Importamos el puerto definido en las variables de entorno
import { PORT } from "./config/envs";

// Importamos la conexión de la base de datos (DataSource) para inicializarla
import { AppDataSource } from "./config/data-source";

// Inicializamos la conexión a la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log("Conexion a la base de datos realizada con éxito");

    // Iniciamos el servidor Express en el puerto configurado
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    // En caso de error al conectar a la base de datos, lo mostramos en consola
    console.error("Error al conectar a la base de datos:", err);
  });
