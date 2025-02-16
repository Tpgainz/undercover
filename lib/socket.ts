import { io } from "socket.io-client";

const newSocket = io(process.env.SOCKET_ORIGIN ?? "http://localhost:3001");

export type TSocket = typeof newSocket;
