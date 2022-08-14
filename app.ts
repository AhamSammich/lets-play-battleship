import express from "express";
import type { Response, Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handleConnection from "./server/server";

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 5055;

app.use(express.static("dist"));
app.get("/", (res: Response) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => handleConnection(socket, io));

server.listen(port, () => {
  console.log(`App is running at 'http://localhost:${port}'...`);
});

export {};
