FROM node:18.7.0

ENV NODE_ENV=production

WORKDIR /app
COPY ["package*.json", "./"]
RUN npm install --omit=dev

COPY ["app.ts","./"]
COPY ["server","./server"]
COPY ["dist","./dist"]

ENV PORT=5055

EXPOSE 5055

CMD ["npm", "start"]