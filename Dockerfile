# ============================
# Etapa 1: Dependencias con cache
# ============================
FROM node:20.15.1-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps


# ============================
# Etapa 2: Build
# ============================
FROM node:20.15.1-alpine AS build

WORKDIR /app

# Copiar node_modules previamente instalados (cache)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Angular SSR para subruta /prioritarios
RUN npm run build -- --configuration production --base-href=/prioritarios/ --deploy-url=/prioritarios/ --prerender=false


# ============================
# Etapa 3: Runtime
# ============================
FROM node:20.15.1-alpine AS runtime

WORKDIR /app

# Copiar dist compilado
COPY --from=build /app/dist ./dist

# Copiar package.json para runtime
COPY package*.json ./

# Instalar dependencias solo para producir (omit dev)
RUN npm install --omit=dev --legacy-peer-deps

# Copiar archivos estáticos extras
COPY robots.txt ./

# Copiar sitemap/robots al browser build (si existe)
RUN cp dist/renta-raiz-frontend-2/sitemap.xml dist/renta-raiz-frontend-2/browser/ 2>/dev/null || true && \
    cp robots.txt dist/renta-raiz-frontend-2/browser/ 2>/dev/null || true

EXPOSE 4000

CMD ["node", "dist/renta-raiz-frontend-2/server/server.mjs"]
