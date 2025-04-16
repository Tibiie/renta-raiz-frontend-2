FROM node:23-alpine-slim as build

WORKDIR /usr/src/app

COPY package*.json ./

# Cambiar la zona horaria a America/New_York (ajústala según tus necesidades)
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/America/Bogota  /etc/localtime && \
    echo "America/Bogota" > /etc/timezone && \
    apk del tzdata


RUN npm install

COPY . .

RUN npm run build 

RUN ls -alt


#stage 2
FROM nginx:1.27.5-alpine-slim

COPY --from=build /usr/src/app/dist/renta-raiz-frontend-2 /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9998