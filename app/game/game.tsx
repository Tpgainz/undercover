"use client";
import { DialogGeneric } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { GameContext } from "@/lib/useGameContext";
import { useContext, useEffect, useState } from "react";
import { TGame } from "../types/types";
import { Input } from "@/components/ui/input";
import { areAllCrewmatesDead, areAllintrudersDead } from "@/lib/allDead";

export default function GameRound() {
  const { game } = useContext(GameContext);

  const [guessingPlayer, setGuessingPlayer] = useState<number | null>(null);

  console.log(game, "game");

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

const ShowWord = ({ word }: { word: string }) => {
  const [showWord, setShowWord] = useState(false);

  if (!word) {
    word = "You are Mister White";
  }

  return (
    <Button
      variant="secondary"
      onClick={() => {
        setShowWord(!showWord);
      }}
    >
      {showWord ? word : "Show word"}
    </Button>
  );
};

const determineRole = (word: string, gameWords: TGame["options"]["words"]) => {
  if (word === gameWords[0]) {
    return "citizen";
  } else if (word === gameWords[1]) {
    return "intruder";
  } else {
    return "M White";
  }
};

const MisterWhiteGuess = ({
  correctWord,
  onClose,
  setGuessingPlayer,
}: {
  onClose: () => void;
  correctWord: string;
  setGuessingPlayer: (index: number | null) => void;
}) => {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  const { game, setGame } = useContext(GameContext);

  const handleGuessSubmit = (guess: string) => {
    // Vérifier si la devinette est correcte
    if (guess.toLowerCase() === correctWord.toLowerCase()) {
      setGame({
        ...game,
        state: "end",
      });
    } else {
      setMessage("Loupé");
      setTimeout(() => {
        setMessage("");
        setGuessingPlayer(null);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 px-4">
      <h1 className="mx-auto  p-2 rounded-md text-center text-2xl">
        Vous avez trouvé un Mister White
      </h1>

      <p className="text-center text-lg">
        Il a maintenant une chance de se rattraper en devinant le mot et
        décrocher la victoire
      </p>

      <DialogGeneric
        title="Your Guess"
        subtitle="Enter the word you think it is"
        trigger={
          <Button size="lg" className="md:mx-auto">
            Guess
          </Button>
        }
      >
        {message ? (
          <p className="text-red-500 text-center text-4xl">{message}</p>
        ) : (
          <div className="flex flex-col gap-4 px-4">
            <Input value={guess} onChange={(e) => setGuess(e.target.value)} />
            <Button
              onClick={() => {
                handleGuessSubmit(guess), onClose;
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </DialogGeneric>
    </div>
  );
};

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

  return (
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
  );
};
