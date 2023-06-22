FROM node:18-alpine3.16

WORKDIR /app
RUN env > .env
COPY ./tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN npm install -g @nestjs/cli

EXPOSE 8080

ENTRYPOINT [ "sh", "/entrypoint.sh" ]