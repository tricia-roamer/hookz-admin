FROM node:14.17

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8080 8081 8082

CMD [ "npm", "start" ]
