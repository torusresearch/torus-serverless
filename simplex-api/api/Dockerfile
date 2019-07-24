FROM node:10.16.0-jessie

ADD crontab /etc/cron.d/cron-events
RUN chmod 0644 /etc/cron.d/cron-events
RUN apt-get update
RUN apt-get -y install cron

ENV NODE_OPTIONS --max-old-space-size=4096
RUN node -v && npm -v
WORKDIR /api

COPY . /api
RUN npm ci
RUN npm run build
EXPOSE 8080/tcp

CMD cron && npm run start