FROM node:16.15.1@sha256:57f6f35ef093186f2e57e8fac481acba4ba780c2a09cb18eddddfb24430f4d00 as build
ENV NODE_ENV=production
WORKDIR /build
COPY package*.json .
RUN npm ci --only=production

FROM node:16.15.1-alpine@sha256:9da65f99264be2a78682095c4789b3d8cab12e0012def7d937d7125ed6e7695c as deploy
USER node
WORKDIR /app
COPY --from=build --chown=node:node ./build .
COPY --chown=node:node . .
CMD "node" "src/index.js"

EXPOSE 8080
