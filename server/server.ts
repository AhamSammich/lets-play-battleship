import type { Socket, Server } from "socket.io";
import { Message } from "./utils";
import Room from "./room";

function joinRoom(socketId: string): string {
  let room = Room.findAvailable();
  if (room) {
    room.join(socketId);
  } else {
    room = Room.open(socketId);
  }
  console.log(`hostId: ${room.host}`);
  return room.id;
}

function announceUser(socket: Socket, room: Room, server: Server): void {
  const io = server;
  const id = socket.id;
  const name = socket.data.username
    ? `${socket.data.username} ( ID: ${id} )`
    : `User ${id}`;
  console.log(`${name} connected to ${room.id}.\n\tHost ID: ${room.host}.`);

  io.to(id).emit(
    "server-info",
    Message.format(
      `You have entered ${room.id}. ( ${room.count}/2 users connected )`,
      { from: "Server" }
    )
  );
  if (id === room.host) return;

  io.to(room.host).emit(
    "server-info",
    Message.format(
      `${name} has entered the room. ( ${room.count}/2 users connected )`,
      { from: "Server" }
    )
  );
}

// FEATURE Warn/disconnect idle player
function handleConnection(socket: Socket, server: Server): void {
  const io = server;

  const roomId = joinRoom(socket.id);
  const room = Room.findById(roomId);
  socket.join(roomId);
  io.to(room.host).emit("player-turn", room.host);

  socket.on("player-ready", (id: string, username = undefined) => {
    if (username) socket.data.username = username;
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
      `\n${
        socket.data.username || "User " + socket.id
      } disconnected from ${roomId}.`
    );
  });

  socket.on("disconnect", () => {
    room.leave(socket.id);
    io.in(roomId).emit(
      "server-info",
      Message.format(
        `${socket.data.username || "User " + socket.id} has disconnected.`,
        { from: "Server" }
      )
    );
  });
}

export default handleConnection;
