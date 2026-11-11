FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY app.js .

EXPOSE 3000

USER 1000

CMD ["node", "app.js"]
