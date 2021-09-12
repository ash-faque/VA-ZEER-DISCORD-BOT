# syntax=docker/dockerfile:1

FROM node:16.9.1

ENV NODE_ENV=production

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]