FROM node:18.7.0

ENV NODE_ENV=production

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --omit=dev

WORKDIR /app/server
COPY ["server/package.json", "server/package-lock.json*", "./"]
RUN npm install --omit=dev


WORKDIR /app
COPY ["app.js","./"]
COPY ["server","./server"]
COPY ["dist","./dist"]

ENV PORT=8088

EXPOSE 8088 5055

CMD ["npm", "start"]