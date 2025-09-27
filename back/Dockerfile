# Stage 1: build the typescript app
FROM node:18-alpine AS builder
WORKDIR /app

# evita reinstalar dependencias si package.json no cambia --
COPY package*.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# copiar artefactos construidos y node_modules de builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Exponer el puerto (la app debe usar process.env.PORT)
EXPOSE 3000

# run the built app
CMD ["node", "dist/index.js"]
