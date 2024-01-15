import { DialogGeneric } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GameContext } from "@/lib/useGameContext";
import { useContext, useState } from "react";

export default function GameIntro() {
  const { game, setGame } = useContext(GameContext);

  const [reject, setReject] = useState(false);



  const checkAllNamed = () => {
    const allNamed = game.players.every((player) => !player.name.includes("Player"));
    console.log(allNamed, "allNamed");
    if (!allNamed) {
      setReject(true);
    } else {
      setGame({ ...game,
        
         state: "playing" });
    }
  };

  return (
    <>
      <div className="flex w-full items-center container mx-auto justify-center gap-4 pb-4">
        <Button
          variant="outline"
          onClick={checkAllNamed}
        >
          Start Game
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 lg:gap-10 items-center justify-center h-full">
        {game.players?.map((player, index) => (
          <DialogGeneric
            title={player.name}
            subtitle="Enter your name to start the game"
            trigger={
              <Card
                variant={player.name.includes("Player") ? reject ? "destructive" : "default" : "valid"}
                className="rounded-full w-[20vw] cursor-pointer lg:w-[15vw] @container flex items-center justify-center p-4 aspect-square"
                key={index}
              >
                <CardTitle className="opacity-60 whitespace-nowrap tracking-tight text-sm @[100px]:text-lg @[150px]:text-xl">
                  {player.name}
                </CardTitle>
              </Card>
            }
            key={index}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl mx-auto border bg-primary/20 p-2 rounded-md">
              {player.word.length > 0  ? `Your word: ${player.word}` : "Mister White"}
              </h1>
              <Input
                defaultValue={player.name}
                onChange={(e) => {
                  const newPlayers = [...game.players];
                  console.log(newPlayers, "newPlayers");
                  newPlayers[index].name = e.target.value;
                  setGame({ ...game, players: newPlayers });
                }}
              />
            </div>
          </DialogGeneric>
        ))}
        <Card
          onClick={() => {
            setGame({
              ...game,
              options: {
                ...game.options,
                joueurs: Number(game.options.joueurs) + 1,
              },
              
            });
          }}
          className="rounded-full w-[20vw] cursor-pointer lg:w-[15vw] @container flex items-center justify-center p-4 aspect-square"
        >
          <CardTitle className="text-4xl">+</CardTitle>
        </Card>
      </div>
    </>
  );
}
