const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const { Message } = require("../server/cjs-utils.js");
const { Room } = require("../server/room.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

instrument(io, {
  auth: false,
});

function joinRoom(socketId) {
  let room = Room.findAvailable();
  if (room) {
    room.join(socketId);
    io.to(room.host).emit(
      "server-info",
      Message.format(
        `User ${socketId} has entered the room. ( ${room.count}/2 users connected )`,
        "Server"
      )
    );
  } else {
    room = Room.open(socketId);
  }
  console.log(`hostId: ${room.host}`);
  return room.id;
}

io.on("connection", (socket) => {
  const roomId = joinRoom(socket.id);
  const room = Room.findById(roomId);
  socket.join(roomId);
  io.to(room.host).emit("player-turn", room.host);

  socket.on("player-ready", (id) => {
    console.log(
      `User ${socket.id} connected to ${roomId}.\n\tHosted by ${room.host}.`
    );

    io.to(id).emit(
      "server-info",
      Message.format(
        `You have entered ${roomId}. ( ${room.count}/2 users connected )`,
        "Server"
      )
    );
  });

  socket.on("message", (data) => {
    socket.in(roomId).emit("message-received", data);
  });

  socket.on("attack", (data) => {
    socket.broadcast.in(roomId).emit("incoming-attack", data);
  });

  socket.on("attack-result", (data) => {
    socket.broadcast.in(roomId).emit("incoming-result", data);
    io.in(roomId).emit("player-turn", socket.id);
  });

  socket.on("game-over", () => {
    socket.broadcast.in(roomId).emit("victory");
  });

  socket.on("disconnecting", async () => {
    io.to(socket.id).emit("server-info", "You have been disconnected.");
    socket.leave(roomId);
    console.log(`\n${socket.id} disconnected from ${roomId}.`);
  });

  socket.on("disconnect", () => {
    room.leave(socket.id);
    io.in(roomId).emit(
      "server-info",
      Message.format(`User ${socket.id} has disconnected.`, "Server")
    );
  });
});

server.listen(5500, () => {
  console.log("Server running on port 5500...");
});
