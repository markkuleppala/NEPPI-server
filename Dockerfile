FROM node:10-alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY package*.json ./

COPY app.js ./

COPY swagger.yaml ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
