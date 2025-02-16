import { io } from "socket.io-client";

const newSocket = io("undercover-wss.vercel.app");

export type TSocket = typeof newSocket;
