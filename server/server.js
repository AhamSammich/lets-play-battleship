const { Timestamp } = require("../server/cjs-utils.js");
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

io.on("connection", async (socket) => {
    let sockets = await io.allSockets();
    io.emit(
        "message-received", 
        Timestamp.add(
            `User ${socket.id} has connected. ${[...sockets].length} players connected.`
        )
    );
    
    //TODO: Distinguish between server messages and chat messages.

    socket.on("message", (data) => {
        // console.log(data);
        socket.broadcast.emit("message-received", data);
    });

    socket.on("attack", (data, fromId) => {
        // console.log(data);
        socket.broadcast.emit("incoming-attack", data, fromId);
    });

    socket.on("attack-result", (data, toId) => {
        // console.log(data);
        io.to(toId).emit("incoming-result", data);
    });

    socket.on("disconnect", () => {
        io.emit(
            "message-received", 
            Timestamp.add(`User ${socket.id} has left.`));
    });
});

server.listen(5500, () => {
    console.log("Server running on port 5500...");
});
