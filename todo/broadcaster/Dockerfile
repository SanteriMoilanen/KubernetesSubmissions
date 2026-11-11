FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install --omit=dev
COPY app.js .

USER 1000

CMD ["node", "app.js"]
