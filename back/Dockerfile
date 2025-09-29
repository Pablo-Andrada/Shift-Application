# back/Dockerfile - optimizado para producción
FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

# Usar la build JS generada (asumo que build pone JS en /dist)
CMD ["node", "dist/index.js"]
