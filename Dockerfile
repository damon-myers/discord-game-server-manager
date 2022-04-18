FROM node:14-slim

ARG SERVER_PORT=7209
ARG AWS_REGION=us-west-2

WORKDIR /app

ENV AWS_REGION=$AWS_REGION
ENV NODE_ENV=production
ENV SERVER_PORT=$SERVER_PORT

## Do this separate from source so that npm ci can be cached
COPY package*.json ./
RUN npm ci --also=dev

COPY . .
RUN npm run build

EXPOSE $SERVER_PORT

ENTRYPOINT ["node", "dist/index.js"]
