import { GameContext } from "@/lib/useGameContext";
import { Ban, Swords } from "lucide-react";
import { useContext, useEffect } from "react";
import { DialogGeneric } from "./dialog";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Label } from "./ui/label";

export function Lobby() {
  const { game, setGame, socket } = useContext(GameContext);

  function kickPlayer(playerName: string) {
    const newPlayers = game.players.filter(
      (player) => player.name !== playerName
    );
    setGame({ ...game, players: newPlayers });
  }

  return (
    <DialogGeneric
      trigger={
        <Button
          size="icon"
          //Check if all players are connected and their name are !== Player
          variant={
            game.players.every(
              (player) => player.isConnected && player.name !== "Player"
            )
              ? "greenOutline"
              : "default"
          }
        >
          <Swords size={20} />
        </Button>
      }
      title="Waiting Room"
      subtitle="Waiting for all the players to be ready, you can set ready by going to the game tab and pick up a Player card and rename it to your name"
    >
      <Card>
        <CardHeader>
          <CardTitle className="mx-auto">Manage players</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 ">
            {game.players.map((player) => (
              <div
                key={player.name}
                className="flex items-center w-[120px] gap-2 "
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    player.isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />

                <Label
                  className="truncate ... font-semibold   
                "
                >
                  {player.name}
                </Label>

                <Ban
                  className="ml-auto cursor-pointer hover:text-destructive"
                  size={16}
                  onClick={() => kickPlayer(player.name)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DialogGeneric>
  );
}
