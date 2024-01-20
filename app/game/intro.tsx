import { DialogGeneric } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GameContext } from "@/lib/useGameContext";
import { useContext, useEffect, useState } from "react";
import { TPlayers } from "../types/types";

export default function GameIntro() {
  const { game, setGame } = useContext(GameContext);
  const [reject, setReject] = useState(false);

  const handleNameChange = (index: number, newName: string) => {
    const uniqueName = generateUniqueName(newName, game.players);

    const newPlayers = game.players.map((player, idx) =>
      idx === index
        ? { ...player, name: uniqueName, isConnected: true }
        : player
    );

    setGame({ ...game, players: newPlayers });

    // Sauvegarde le nom unique dans sessionStorage
    sessionStorage.setItem("playerName", uniqueName);
  };

  // Ajouter un joueur
  const addPlayer = () => {
    setGame({
      ...game,
      players: [
        ...game.players,
        { name: `Player ${game.players.length + 1}`, word: "", isAlive: true },
      ],
    });
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
        <Button
          size="lg"
          className="mx-auto"
          onClick={() => setGame({ ...game, state: "playing" })}
        >
          Start Game
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 lg:gap-10 items-center justify-center h-full">
        {game.players?.length === 0 && <MissConfig />}
        {game.players?.map((player, index) => (
          <IntroRoleCard
            mode={game.mode}
            key={player.name}
            player={player}
            index={index}
            onNameChange={handleNameChange}
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

const generateUniqueName = (proposedName: string, players: TPlayers[]) => {
  let uniqueName = proposedName;
  let count = 1;

  // Vérifie si le nom proposé existe déjà et ajuste le nom avec un index
  while (players.some((player) => player.name === uniqueName)) {
    uniqueName = `${proposedName} (${count})`;
    count++;
  }

  return uniqueName;
};

const IntroRoleCard = ({
  player,
  index,
  mode,
  onNameChange,
  reject,
}: {
  player: TPlayers;
  index: number;
  mode?: string;
  onNameChange: (index: number, newName: string) => void;
  reject?: boolean;
}) => {
  const [name, setName] = useState(player.name);
  const sessionName = sessionStorage.getItem("playerName");
  const isCurrentPlayer = sessionName === player.name;
  const avaliable = !sessionName && player.name.includes("Player");

  console.log(player.name, sessionName, isCurrentPlayer, avaliable);

  const onlineSave = isCurrentPlayer || avaliable;

  const handleChangeName = () => {
    onNameChange(index, name);
  };

  return (
    <DialogGeneric
      title={player.name}
      additionalAction={
        mode === "oneforall" ? (
          <Button
            variant="greenOutline"
            onClick={handleChangeName}
            disabled={name.length === 0}
          >
            Save
          </Button>
        ) : (
          onlineSave && (
            <Button
              variant="greenOutline"
              onClick={handleChangeName}
              disabled={name.length === 0}
            >
              Save
            </Button>
          )
        )
      }
      subtitle={
        isCurrentPlayer
          ? "Fill up your infos"
          : " Here you can see your friends infos"
      }
      trigger={
        <Card
          variant={
            player.name.includes("Player")
              ? reject
                ? "destructive"
                : "outline"
              : isCurrentPlayer
              ? "currentValid"
              : "valid"
          }
          className="rounded-full  w-[25vw] cursor-pointer lg:w-[15vw] @container flex items-center justify-center p-4 aspect-square"
          key={index}
        >
          <CardTitle className="opacity-60 whitespace-nowrap tracking-tight text-sm @[100px]:text-lg @[150px]:text-xl">
            {player.name}
          </CardTitle>
        </Card>
      }
      key={index}
    >
      {mode === "allforone" ? (
        <AllForOneInfos {...{ isCurrentPlayer, avaliable, player, setName }} />
      ) : (
        <OneForAllInfos {...{ player, setName }} />
      )}
    </DialogGeneric>
  );
};
const AllForOneInfos = ({
  isCurrentPlayer,
  avaliable,
  player,
  setName,
}: {
  isCurrentPlayer: boolean;
  avaliable: boolean;
  player: TPlayers;
  setName: (arg0: string) => void;
}) => {
  return (
    (isCurrentPlayer || avaliable) && (
      <div
        className="flex flex-col px-4 
        gap-4"
      >
        <h1
          className="text-2xl mx-auto bg-input p-2 rounded-lg
           ..."
        >
          {isCurrentPlayer || !player.isAlive
            ? player.word.length > 0
              ? `${player.word}`
              : "Mister White"
            : null}
        </h1>

        <Input
          placeholder={player.name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    )
  );
};

const OneForAllInfos = ({
  player,
  setName,
}: {
  player: TPlayers;
  setName: (arg0: string) => void;
}) => {
  return (
    <>
      <div className="flex flex-col px-4 gap-4">
        <h1
          className="text-2xl mx-auto bg-input p-2 rounded-lg
         ..."
        >
          {player.word.length > 0 ? `${player.word}` : "Mister White"}
        </h1>
        <Input
          placeholder={player.name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </>
  );
};
