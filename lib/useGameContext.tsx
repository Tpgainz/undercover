"use client";
import { TGame, TGameContext } from "@/app/types/types";
import { createContext, useEffect, useRef, useState } from "react";
import { createPlayers } from "./createPlayers";
import { defaultGame } from "./gameData";
import { TSocket } from "./socket";
import { initGame } from "./initGame";
import { io } from "socket.io-client";
import React from "react";

export const GameContext = createContext<TGameContext>({
  game: defaultGame,
  setGame: () => {},
  socket: undefined,
  isConnected: false,
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState(defaultGame);
  const [socket, setSocket] = useState<TSocket>();
  const [isConnected, setIsConnected] = useState(false);

  const gameRef = useRef(game);

  useEffect(() => {
    const newSocket = io(process.env.SOCKET_ORIGIN ?? "http://localhost:5555", {
      autoConnect: false,
    });
    setSocket(newSocket);
    

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("game_update", (updatedGame) => {
        console.log("Received game update");
        gameRef.current = updatedGame; // Mettre à jour la référence avant de définir l'état
        setGame(updatedGame);
      });
      return () => {
        socket.off("game_update");
      };
    }
  }, [socket]);

  useEffect(() => {
    // Vérifier si les options du jeu ont changé
    if (game.options) {
      setGame((prevGame) => {
        // Initialiser ou mettre à jour les joueurs en fonction des options du jeu
        const players = initGame(prevGame);
        const updatedPlayers = createPlayers({ ...prevGame, players });
        return { ...prevGame, players: updatedPlayers };
      });
    }
  }, [game.options]);

  useEffect(() => {
    // Vérifier si les changements concernent autre chose que les 'players'
    const shouldEmitUpdate =
      game !== gameRef.current &&
      // Ajouter ici des conditions pour les parties de 'game' qui nécessitent une mise à jour
      (game.options !== gameRef.current.options ||
        game.state !== gameRef.current.state ||
        game.players.map((player) => player.name).join() !==
          gameRef.current.players.map((player) => player.name).join());

    if (shouldEmitUpdate && socket && isConnected) {
      socket.emit("game", game);
      gameRef.current = game; // Mettre à jour la référence
    }
  }, [game, socket, isConnected]);

  useEffect(() => {
    sessionStorage.setItem("game", JSON.stringify(game));
  }, [game]);

  return (
    <GameContext.Provider value={{ game, setGame, socket, isConnected }}>
      {children}
    </GameContext.Provider>
  );
};
