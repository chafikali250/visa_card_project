FROM node:18.20-alpine AS base

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

USER node

EXPOSE 3000

CMD ["node", "server.js"]

