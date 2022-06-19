FROM node:16.15.1

LABEL maintainer="Jeffrey Huynh <jhuynh34@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm start

EXPOSE 8080
