"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameContext } from "@/lib/useGameContext";
import { useContext, useEffect, useState } from "react";
import { RoleCard } from "./game-dialog";

export default function GameIntro() {
  const { game, setGame } = useContext(GameContext);
  const [reject, setReject] = useState(false);

  // Ajouter un joueur
  const addPlayer = () => {
    setGame({
      ...game,
      options: { ...game.options, joueurs: game.options.joueurs + 1 },
      players: [
        ...game.players, // Ajouter un nouveau joueur
        {
          name: `Player ${game.players.length + 1}`,
          isAlive: true,
          isConnected: false,
          word: "",
        },
      ],
    });
  };

  const handleStartGame = () => {
    if (
      game.players.length > 0 &&
      !game.players.some((player) => player.name.includes("Player"))
    ) {
      setGame({ ...game, state: "playing" });
    } else {
      setReject(true);
      setTimeout(() => {
        setReject(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const sessionName = sessionStorage.getItem("playerName");
    if (
      sessionName &&
      !game.players.some((player) => player.name === sessionName)
    ) {
      sessionStorage.removeItem("playerName");
    }
  }, [game.players]);

  return (
    <>
      <div className="flex w-full items-center container mx-auto justify-center gap-4 pb-4">
        <Button size="lg" className="mx-auto" onClick={handleStartGame}>
          Start Game
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 lg:gap-10 items-center justify-center h-full">
        {game.players?.length === 0 && <MissConfig />}
        {game.players?.map((player, index) => (
          <RoleCard
            key={player.name}
            player={player}
            index={index}
            reject={reject}
          />
        ))}

        <Card
          variant="outline"
          onClick={addPlayer}
          className="rounded-full w-[25vw] cursor-pointer lg:w-[15vw] @container flex items-center justify-center p-4 aspect-square"
        >
          <CardTitle className="text-xl lg:text-4xl">+</CardTitle>
        </Card>
      </div>
    </>
  );
}

const MissConfig = () => {
  return (
    <Card variant="destructive">
      <CardHeader>Merci de revoir les parametres de la partie</CardHeader>
      <CardContent>
        Essayer de rajouter des joueurs ou de revoir le nombre de Mister White
        et d&apos;intrus
      </CardContent>
    </Card>
  );
};
