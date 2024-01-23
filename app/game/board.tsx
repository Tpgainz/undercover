"use client";

import { MisterWhiteGuess } from "@/components/mister-white-guess";
import { areAllintrudersDead, areAllCrewmatesDead } from "@/lib/allDead";
import { determineRole } from "@/lib/determineRole";
import { GameContext } from "@/lib/useGameContext";
import { useContext, useState, useEffect } from "react";
import { TGame } from "../types/types";
import { RoleCard } from "./game-dialog";

export default function GameBoard() {
  const { game } = useContext(GameContext);

  const [guessingPlayer, setGuessingPlayer] = useState<number | null>(null);

  return (
    <>
      {guessingPlayer !== null && game.players[guessingPlayer]?.word === "" ? (
        <MisterWhiteGuess
          setGuessingPlayer={setGuessingPlayer}
          correctWord={game.options.words[0]}
          onClose={() => setGuessingPlayer(null)}
        />
      ) : (
        <GameSet
          title={`${game.players[startingPlayer(game)].name} starts the game`}
          setGuessingPlayer={setGuessingPlayer}
        />
      )}
    </>
  );
}

const GameSet = ({
  title,
  setGuessingPlayer,
}: {
  title: string;
  setGuessingPlayer: (index: number) => void;
}) => {
  const { game, setGame } = useContext(GameContext);

  useEffect(() => {
    if (areAllintrudersDead(game) || areAllCrewmatesDead(game)) {
      setGame({
        ...game,
        state: "end",
      });
    }
  }, [game.players]);

  //Pick a random crewmate (alive) to start the game

  return (
    <>
      <h1 className="text-2xl lg:text-4xl text-center mb-4 lg:mb-16">
        {title}
      </h1>

      <div className="flex flex-wrap gap-4 lg:gap-10 items-center justify-center h-full">
        {game.players?.map((player, index) => (
          <RoleCard
            {...{ player, index, setGuessingPlayer, reject: !player.isAlive }}
            key={player.name}
          />
        ))}
      </div>
    </>
  );
};

const startingPlayer = (game: TGame) => {
  return game.players.findIndex(
    (player) =>
      player.isAlive &&
      determineRole(player.word, game.options.words) === "citizen"
  );
};
