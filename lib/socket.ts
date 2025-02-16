import { io } from "socket.io-client";

const newSocket = io(process.env.SOCKET_ORIGIN);

export type TSocket = typeof newSocket;
