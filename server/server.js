const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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

function joinRoom(socketId) {
  let room = Room.findAvailable();
  if (room) {
    room.join(socketId);
  } else {
    room = Room.open(socketId);
  }
  console.log(`hostId: ${room.host}`);
  return room.id;
}

function announceUser(socket, room, server) {
  const io = server;
  const id = socket.id;
  const name = socket.username
    ? `${socket.username} ( ID: ${id} )`
    : `User ${id}`;
  console.log(`${name} connected to ${room.id}.\n\tHost ID: ${room.host}.`);

  io.to(id).emit(
    "server-info",
    Message.format(
      `You have entered ${room.id}. ( ${room.count}/2 users connected )`,
      "Server"
    )
  );
  if (id === room.host) return;

  io.to(room.host).emit(
    "server-info",
    Message.format(
      `${name} has entered the room. ( ${room.count}/2 users connected )`,
      "Server"
    )
  );
}

io.on("connection", (socket) => {
  const roomId = joinRoom(socket.id);
  const room = Room.findById(roomId);
  socket.join(roomId);
  io.to(room.host).emit("player-turn", room.host);

  socket.on("player-ready", (id, username = undefined) => {
    if (username) socket.username = username;
    announceUser(socket, room, io);
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
    console.log(
      `\n${socket.username || "User " + socket.id} disconnected from ${roomId}.`
    );
  });

  socket.on("disconnect", () => {
    room.leave(socket.id);
    io.in(roomId).emit(
      "server-info",
      Message.format(
        `${socket.username || "User " + socket.id} has disconnected.`,
        "Server"
      )
    );
  });
});

module.exports = server;
