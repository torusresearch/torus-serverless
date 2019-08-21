FROM node:buster

ENV NODE_OPTIONS --max-old-space-size=4096
WORKDIR /api

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
EXPOSE 8080/tcp

CMD ["npm", "start"]