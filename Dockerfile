# Etapa 1: Build
FROM node:20.15.1-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

# Configurar zona horaria
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/America/Bogota /etc/localtime && \
    echo "America/Bogota" > /etc/timezone && \
    apk del tzdata

RUN npm install

COPY . .

# 👇 Aquí cambiamos a build SSR en lugar del build normal
RUN npm run build:ssr

# Etapa 2: Runtime
FROM node:20.15.1-alpine AS runtime

WORKDIR /usr/src/app

# Copiamos solo los artefactos de build y package.json
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm install --omit=dev

# Puerto del servidor SSR
EXPOSE 4000

# Arranque del servidor Angular Universal
CMD ["node", "dist/renta-raiz-frontend-2/server/server.mjs"]
