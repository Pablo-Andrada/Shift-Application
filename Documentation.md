# Proyecto de Turnos para Taller de Autos

Este proyecto es un sistema de turnos diseñado específicamente para talleres de autos. Permite gestionar turnos, almacenar información detallada sobre los clientes y sus vehículos, y llevar un control eficiente de los presupuestos y mejoras implementadas.

## Características Principales

- **Gestión de Turnos**: Permite agendar y consultar turnos con detalles completos del cliente y el vehículo.
- **Información del Cliente**: Registro de datos personales y de contacto.
- **Detalles del Vehículo**: Descripción de los inconvenientes y mejoras implementadas.
- **Presupuestos**: Generación y actualización de presupuestos para cada turno.

## Tecnologías Utilizadas

- **Frontend**: React, TailwindCSS.
- **Backend**: Node.js, Express.
- **Base de Datos**: MongoDB. TypeORM, PostgreSQL.

## Instrucciones para Iniciar el Proyecto

1. Clona el repositorio desde GitHub:
   ```bash
   git clone https://github.com/tu-usuario/turnos-taller-autos.git
   ```
2. Accede al directorio del proyecto:
   ```bash
   cd turnos-taller-autos
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
4. Configura las variables de entorno en un archivo `.env` basado en el archivo `.env.example` proporcionado.
5. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

## Capturas de Pantalla

_Aquí puedes agregar capturas de pantalla del sistema para ilustrar cómo funciona._

## Contribuciones

Las contribuciones son bienvenidas. Si tienes sugerencias o mejoras, por favor abre un issue o envía un pull request.

## Autor

Creado por [Tu Nombre](https://github.com/tu-usuario).

## Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).

## Documentación de creación del proyecto:

### General:

-1 Creé la carpeta del proyecto: - Creo la carpeta del proyecto, dentro del mismo, dos carpetas más, una del "Back", otra del "Front" y ademas 2 archivos, un .gitignore y un Documentation.md, justamente este mismo archivo

### Back:

1- Generamos el package.json:
con npm init -y
2- Instalamos typescript localmente:
npm install typescript --save-dev
3- Generamos el archivo tsconfig.json con el comando:
tsc --init
4- Ajusto en tsconfig.json las configuraciones:
a- Descomento "outDir":"./dist"
b- Al final del ts config escribo:
"files":["./src/index.ts"] (aca indico que archivo ts quiero traducir a js, para que no traduzca todos los .ts que encuentre)
5- Configuro el comando build para que ejecute el compilador de TypeScript y el comando start para que ejecute dicho build:
"scripts":{
"build":"tsc", // npm run build
"start":"node ./dist/index.js" , // npm start
}
6- Crear la carpeta src del proyecto y el módulo index.ts.
