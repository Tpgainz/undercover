import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { socketHandler } from "./utils/handler";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  socketHandler(socket);
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
