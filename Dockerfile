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

# 👇 En Angular 17 con @angular/ssr el build normal ya genera SSR
RUN npm run build

# Etapa 2: Runtime
FROM node:20.15.1-alpine AS runtime

WORKDIR /usr/src/app

# Copiamos solo lo necesario
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev

# Puerto en el que corre Angular Universal
EXPOSE 9998

# Arrancar el servidor SSR
CMD ["node", "dist/renta-raiz-frontend-2/server/server.mjs"]
