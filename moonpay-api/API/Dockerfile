FROM node:10.16.0-jessie

ENV NODE_OPTIONS --max-old-space-size=4096
WORKDIR /api

COPY . /api
RUN npm ci
RUN npm run build
EXPOSE 2040/tcp

CMD npm run start