# back/Dockerfile (multi-stage) - reemplazar completamente

# --------------------------
# Stage 1 - build
# --------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Instalo paquetes del package.json (incluye devDependencies)
# Uso npm ci para instalación reproducible (requiere package-lock.json)
COPY package*.json ./
RUN npm ci

# Copio el código fuente y compilo TypeScript
COPY . .
RUN npm run build

# --------------------------
# Stage 2 - production runtime
# --------------------------
FROM node:18-alpine AS runner
WORKDIR /app

# Copio sólo package.json y package-lock.json para instalar prod deps
COPY package*.json ./

# Instalo solo production dependencies
RUN npm ci --only=production

# Copio la carpeta dist compilada desde el build stage
COPY --from=builder /app/dist ./dist

# Si necesitás archivos estáticos u otros assets:
# COPY --from=builder /app/public ./public

EXPOSE 3000

# Start command (ajusta si tu entry point es otro archivo)
CMD ["node", "dist/index.js"]
