import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";

const app = express();
const server = createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:3000", // URL du client
    methods: ["GET", "POST"], // Méthodes HTTP autorisées
  },
});
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("create_room", ({ roomId }) => {
    console.log("Create room request received for room:", roomId);
    socket.join(roomId); // Ajouter le socket à la room
    socket.emit("room_created", { roomId }); // Confirmer la création de la room
  });

  socket.on("edit_room", ({ roomId, newRoomId }) => {
    console.log("Edit room request received", roomId, newRoomId);
    socket.leave(roomId); // Quitter l'ancienne room
    socket.join(newRoomId); // Rejoindre la nouvelle room
    socket.emit("room_edited", { oldRoomId: roomId, newRoomId });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
