# Build step
FROM node:16.15.1@sha256:57f6f35ef093186f2e57e8fac481acba4ba780c2a09cb18eddddfb24430f4d00 as build

LABEL maintainer="Jeffrey Huynh <jhuynh34@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_ENV=production
ENV NPM_CONFIG_COLOR=false

WORKDIR /build

COPY package*.json ./

RUN npm ci --only=production

# Production step
FROM node:16.15.1-alpine@sha256:9da65f99264be2a78682095c4789b3d8cab12e0012def7d937d7125ed6e7695c as deploy

ENV PORT=8080

USER node

WORKDIR /app

COPY --from=build --chown=node:node ./build .
COPY --chown=node:node . .

CMD ["node", "src/index.js"]

EXPOSE 8080
