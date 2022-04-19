FROM node:14-slim

ARG SERVER_PORT=7209
ARG AWS_REGION=us-west-2

WORKDIR /app


ENV AWS_REGION=$AWS_REGION
ENV NODE_ENV=production
ENV SERVER_PORT=$SERVER_PORT

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

## Do this separate from source so that npm ci can be cached
COPY package*.json ./
RUN npm ci --also=dev

COPY . .
RUN npm run build

EXPOSE $SERVER_PORT

ENTRYPOINT ["/tini", "--"]

# Run under Tini so it handles signals
CMD ["node", "dist/index.js"]
