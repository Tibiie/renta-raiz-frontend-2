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

RUN npm run build -- --configuration production --base-href=/prioritarios/ --deploy-url=/prioritarios/ --prerender=false

# Etapa 2: Runtime
FROM node:20.15.1-alpine AS runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/robots.txt ./   

# Copiar sitemap y robots.txt a la carpeta pública
RUN cp /usr/src/app/dist/renta-raiz-frontend-2/sitemap.xml /usr/src/app/dist/renta-raiz-frontend-2/browser/ && \
    cp /usr/src/app/robots.txt /usr/src/app/dist/renta-raiz-frontend-2/browser/

RUN npm install --omit=dev

EXPOSE 4000

CMD ["node", "dist/renta-raiz-frontend-2/server/server.mjs"]
