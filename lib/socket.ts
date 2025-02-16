import { io } from "socket.io-client";

const newSocket = io("https://undercover-wss.vercel.app");

export type TSocket = typeof newSocket;
