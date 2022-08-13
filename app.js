const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { handleConnection } = require("./server/server")

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5055;

app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// EXPERIMENTAL Reveal the assigned port
app.get("/port", (req, res) => {
  res.send(`${port}`);
});

io.on("connection", (socket) => handleConnection(socket, io));

server.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});