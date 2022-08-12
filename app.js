const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { handleConnection } = require("./server/server");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 5055;

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

io.on("connection", (socket) => handleConnection(socket, io));

server.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});