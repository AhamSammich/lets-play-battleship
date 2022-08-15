import type { Socket, Server } from "socket.io";
declare function handleConnection(socket: Socket, server: Server): void;
export default handleConnection;
