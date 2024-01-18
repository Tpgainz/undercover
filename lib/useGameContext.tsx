"use client";
import { TGame, TGameContext } from "@/app/types/types";
import { createContext, useEffect, useState } from "react";
import { createPlayers } from "./createPlayers";
import { defaultGame } from "./gameData";
import { TSocket } from "./socket";
import { initGame } from "./initGame";
import { io } from "socket.io-client";

export const GameContext = createContext<TGameContext>({
  game: defaultGame,
  setGame: () => {},
  socket: undefined,
  isConnected: false,
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState<TGame>(defaultGame);
  const [socket, setSocket] = useState<TSocket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (game.mode === "allforone") {
      const newSocket = io("http://localhost:3001");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      // Gestionnaire d'événement pour la mise à jour du jeu depuis le serveur
      newSocket.on("game_update", (updatedGame: TGame) => {
        setGame(updatedGame);
      });

      return () => {
        newSocket.off("edit_room");
        newSocket.off("create_room");
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("game_update");
        newSocket.close();
      };
    }
  }, [game.mode]);

  useEffect(() => {
    setGame((prevGame) => {
      const players = initGame(prevGame);
      const updatedPlayers = createPlayers({ ...prevGame, players });
      return { ...prevGame, players: updatedPlayers };
    });
  }, [
    game.options.joueurs,
    game.options.misterWhite,
    game.options.intrus,
    game.options.words,
  ]);

  useEffect(() => {
    sessionStorage.setItem("game", JSON.stringify(game));
  }, [game]);

  return (
    <GameContext.Provider
      value={{ game, setGame, socket: socket, isConnected }}
    >
      {children}
    </GameContext.Provider>
  );
};
