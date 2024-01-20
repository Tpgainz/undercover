// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { TSocket } from "./socket";
// import { TGame } from "@/app/types/types";

// export const useGameSocket = (
//   url: string,
//   game: TGame,
//   setGame: (game: TGame) => void
// ) => {
//   const [socket, setSocket] = useState<TSocket | undefined>(undefined);
//   const [isConnected, setIsConnected] = useState<boolean>(false);

//   useEffect(() => {
//     async function fetchMyAPI() {
//       if (game.mode === "allforone") {
//         const newSocket = io("http://localhost:3001");
//         setSocket(newSocket);

//         newSocket.on("connect", () => {
//           console.log("Connected to server");
//           setIsConnected(true);
//         });

//         try {
//           const res = await newSocket.timeout(1000).emitWithAck("game", game);
//           console.log(res, "res");
//         } catch (error) {
//           console.log(error);
//         } finally {
//           newSocket.on("game_update", (game: TGame) => {
//             setGame(game);
//           });
//         }

//         newSocket.on("disconnect", () => {
//           console.log("Disconnected from server");
//           setIsConnected(false);
//         });

//         return () => {
//           newSocket.off("edit_room");
//           newSocket.off("create_room");
//           newSocket.off("connect");
//           newSocket.off("disconnect");
//           newSocket.close();
//         };
//       }
//     }
//     fetchMyAPI();
//   }, [game]);

//   useEffect(() => {
//     sessionStorage.setItem("game", JSON.stringify(game));
//   }, [game]);

//   // Vous pouvez ajouter d'autres effets ou logiques ici si nécessaire

//   return { socket, isConnected };
// };
