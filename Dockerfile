FROM node:14-slim

ARG SERVER_PORT=7209

WORKDIR /app

ENV NODE_ENV=production
ENV SERVER_PORT=$SERVER_PORT

## Do this separate from source so that npm ci can be cached
COPY package*.json ./
RUN npm ci --also=dev

COPY . .
RUN npm run build

EXPOSE $SERVER_PORT

ENTRYPOINT ["node", "dist/index.js"]
