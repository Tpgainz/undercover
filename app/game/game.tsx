"use client";
import { DialogGeneric } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { GameContext } from "@/lib/useGameContext";
import { useContext, useEffect, useState } from "react";
import { areAllCrewmatesDead, areAllintrudersDead } from "@/lib/allDead";
import { MisterWhiteGuess } from "@/components/mister-white-guess";
import { determineRole } from "@/lib/determineRole";
import { ShowWord } from "@/components/ShowWords";

export default function GameRound() {
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
        <GameBoard setGuessingPlayer={setGuessingPlayer} />
      )}
    </>
  );
}

const GameBoard = ({
  setGuessingPlayer,
}: {
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
  }, [game.players, setGame]);

  //Pick a random crewmate (alive) to start the game
  const startingPlayer = game.players.findIndex(
    (player) =>
      player.isAlive &&
      determineRole(player.word, game.options.words) === "citizen"
  );

  return (
    <>
      <h1 className="text-2xl lg:text-4xl text-center mb-4 lg:mb-16">
        {game.players[startingPlayer]?.name} starts the game
      </h1>

      <div className="flex flex-wrap gap-4 lg:gap-10 items-center justify-center h-full">
        {game.players?.map((player, index) => (
          <DialogGeneric
            enabled={player.isAlive}
            title={player.name}
            subtitle="In this menu you can kill a player or remind yourself of your word"
            trigger={
              <Card
                variant={player.isAlive ? "valid" : "destructive"}
                className="rounded-full w-[25vw] cursor-pointer lg:w-[15vw] @container flex items-center justify-center p-4 aspect-square"
                key={index}
              >
                <CardTitle className="opacity-60 whitespace-nowrap flex flex-col items-center justify-center tracking-tight text-sm @[100px]:text-lg @[150px]:text-xl">
                  <p>{player.name}</p>
                  {!player.isAlive && (
                    <>
                      <p> - </p>
                      <p>{determineRole(player.word, game.options.words)}</p>
                    </>
                  )}
                </CardTitle>
              </Card>
            }
            key={index}
          >
            <div className="flex flex-col px-4 gap-4">
              <ShowWord word={player.word} />
              <Button
                onClick={() => {
                  const newPlayers = [...game.players];
                  newPlayers[index].isAlive = false;
                  if (
                    determineRole(player.word, game.options.words) === "M White"
                  ) {
                    setGuessingPlayer(index);
                  }
                  setGame({
                    ...game,
                    players: newPlayers,
                  });
                }}
              >
                Kill
              </Button>
            </div>
          </DialogGeneric>
        ))}
      </div>
    </>
  );
};
