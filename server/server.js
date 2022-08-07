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
    let key = Object.keys(ROOMS).find(key => ROOMS[key].count < 2);
    let roomId = key ? key : `Room#${Object.keys(ROOMS).length + 1}`;
    if (key) {
        let hostId = ROOMS[roomId].host;
        let room = ROOMS[roomId];
        room.count++;
        io.to(hostId).emit(
            "server-info", 
            Message.format(
                `A new player entered ${roomId}. Players connected: ${room.count}.`,
                "server"
            )
        );
    } else {
        // Create a new room and allow the host the first turn.
        ROOMS[roomId] = { host: socket.id, count: 1 };
    }
    socket.join(roomId);

    socket.on("ready", (id) => {
        let room = ROOMS[roomId];
        console.log(`User ${socket.id} connected to ${roomId}. Hosted by ${room.host}.`);
        // if (id === room.host) io.emit("player-turn", id);
        io.in(roomId).emit("player-turn", room.host);
        io.to(id).emit(
            "server-info", 
            Message.format(
                `You have entered ${roomId}. Players connected: ${room.count}.`,
                "server"
            )
        );
    });
    
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
        io.in(roomId).emit("player-turn", socket.id);
    });

    socket.on("disconnecting", async () => {
        let room = ROOMS[roomId];
        room.count--;
        socket.leave(roomId);
        if (socket.id === room.host) {
            let sockets = await io.in(roomId).fetchSockets();
            room.host = sockets[0].id;
            // io.to(room.host).emit("player-turn", room.host);
            console.log("\nNew host: " + room.host);
        }
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
