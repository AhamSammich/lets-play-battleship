"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const server_1 = __importDefault(require("./server"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const port = process.env.PORT || 5055;
app.use(express_1.default.static("dist"));
app.get("/", (res) => {
    res.sendFile("index.html");
});
io.on("connection", (socket) => (0, server_1.default)(socket, io));
server.listen(port, () => {
    console.log(`App is running at 'http://localhost:${port}'...`);
});
