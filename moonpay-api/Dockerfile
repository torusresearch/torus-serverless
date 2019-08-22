FROM node:buster

ENV NODE_OPTIONS --max-old-space-size=4096
WORKDIR /api

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]