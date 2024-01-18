import { io } from "socket.io-client";

const newSocket = io("http://localhost:3001");

export type TSocket = typeof newSocket;
