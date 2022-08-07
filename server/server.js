const { Message } = require("../server/cjs-utils.js");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const ROOMS = {};

io.on("connection", async (socket) => {
    let key = Object.keys(ROOMS).find(key => ROOMS[key] < 2);
    let roomId = key ? key : socket.id.slice(0, 5);
    console.log(roomId);
    if (socket.id.slice(0,5) === roomId) {
        ROOMS[roomId] = 1;
    } else {
        ROOMS[roomId]++;
        console.log(ROOMS[roomId]);
    }
    socket.join(roomId);
    io.in(roomId).emit(
        "server-info", 
        Message.format(
            `A new player has connected to Room#${Object.keys(ROOMS).indexOf(roomId) + 1}. Players connected: ${ROOMS[roomId]}.`,
            "server"
        )
    );
    
    socket.on("message", (data) => {
        // console.log(data);
        socket.in(roomId).emit("message-received", data);
    });

    socket.on("attack", (data, fromId) => {
        // console.log(data);
        socket.in(roomId).emit("incoming-attack", data, fromId);
    });

    socket.on("attack-result", (data, toId) => {
        // console.log(data);
        io.to(toId).emit("incoming-result", data);
        io.in(roomId).emit("player-turn", toId);
    });

    socket.on("disconnecting", () => {
        ROOMS[roomId]--;
        socket.leave(roomId);
    })

    socket.on("disconnect", () => {
        io.in(roomId).emit(
            "server-info", 
            Message.format(`User ${socket.id} has left.`, "server"));
    });
});

server.listen(5500, () => {
    console.log("Server running on port 5500...");
});
