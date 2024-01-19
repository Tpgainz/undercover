import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { socketHandler } from "./utils/handler";
import { schemas } from "./shared/schema";
import Actions from "./shared/emits";

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

if (process.env.NODE_ENV === "development") {
  const areKeysIdentical = (keys1: string[], keys2: string[]) => {
    return (
      keys1.length === keys2.length && keys1.every((key) => keys2.includes(key))
    );
  };
  const keysAreIdentical = areKeysIdentical(
    Object.keys(schemas),
    Object.keys(Actions)
  );

  if (!keysAreIdentical) {
    console.error(
      "Les clés des schémas et des actions ne sont pas identiques!"
    );
  }
}
