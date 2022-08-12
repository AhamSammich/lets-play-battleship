FROM node:18.7.0

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY ["app.js", "server", "dist", "./"]

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "prod:start-server"]