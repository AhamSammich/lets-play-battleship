const { Message } = require("../server/cjs-utils.js");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

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

const ROOMS = {};

io.on("connection", async (socket) => {
  let key = Object.keys(ROOMS).find((key) => ROOMS[key].count < 2);
  let roomId = key ? key : `Room #${Object.keys(ROOMS).length + 1}`;
  if (key) {
    let hostId = ROOMS[roomId].host;
    if (hostId == undefined) {
      ROOMS[roomId].host = socket.id;
      hostId = ROOMS[roomId].host;
    }
    let room = ROOMS[roomId];
    room.count++;
    io.to(hostId).emit(
      "server-info",
      Message.format(
        `User ${socket.id} has entered the room. ( ${room.count}/2 users connected )`,
        "Server"
      )
    );
  } else {
    ROOMS[roomId] = { host: socket.id, count: 1 };
  }
  socket.join(roomId);

  socket.on("ready", (id) => {
    let room = ROOMS[roomId];
    console.log(
      `User ${socket.id} connected to ${roomId}.\n\tHosted by ${room.host}.`
    );
    io.timeout(3000).in(roomId).emit("player-turn", room.host);
    io.timeout(3000)
      .to(id)
      .emit(
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
    let room = ROOMS[roomId];
    room.count--;
    io.to(socket.id).emit("server-info", "You have been disconnected.");
    socket.leave(roomId);
    if (socket.id === room.host) {
      let sockets = await io.in(roomId).fetchSockets();
      room.host = sockets[0]?.id;
      console.log("\nNew host: " + room.host);
    }
  });

  socket.on("disconnect", () => {
    io.in(roomId).emit(
      "server-info",
      Message.format(`User ${socket.id} has disconnected.`, "Server")
    );
  });
});

server.listen(5500, () => {
  console.log("Server running on port 5500...");
});
