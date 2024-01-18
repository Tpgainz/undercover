import { Button } from "@/components/ui/button";
import { GameContext } from "@/lib/useGameContext";
import { useContext } from "react";
import { areAllCrewmatesDead, areAllintrudersDead } from "@/lib/allDead";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pickRandomWords } from "@/lib/gameData";
import { createPlayers } from "@/lib/createPlayers";

export function GameEnd() {
  const { game, setGame } = useContext(GameContext);

  const winner = areAllintrudersDead(game)
    ? "intruders"
    : areAllCrewmatesDead(game)
    ? "crewmates"
    : "Mister White";

  function generateGame() {
    const newRandomPlayers = createPlayers(game);
    const newRandomWords = pickRandomWords();
    setGame({
      ...game,
      players: newRandomPlayers,
      options: { ...game.options, words: newRandomWords },

      state: "intro",
    });
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className=" max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Game Over</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          The {winner} win!
        </CardContent>
        <CardFooter>
          <Button onClick={generateGame}>Play again</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
