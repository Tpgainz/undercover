import { ShowWord } from "@/components/ShowWords";
import { DialogGeneric } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { TPlayers } from "../types/types";
import { Card, CardTitle } from "@/components/ui/card";
import { determineRole } from "@/lib/determineRole";
import { GameContext } from "@/lib/useGameContext";
import { getUniqueName } from "@/lib/getUniqueName";

export const RoleCard = ({
  player,
  index,
  reject,
}: {
  player: TPlayers;
  index: number;
  reject?: boolean;
}) => {
  const { game, setGame } = useContext(GameContext);
  const { mode } = game;
  const [name, setName] = useState(player.name);
  const sessionName = sessionStorage.getItem("playerName");
  const isCurrentPlayer = sessionName === player.name;

  const avaliable = !sessionName && player.name.includes("Player");

  const handleChangeName = () => {
    const uniqueName = getUniqueName(name, game.players);

    const newPlayers = game.players.map((player, idx) =>
      idx === index
        ? { ...player, name: uniqueName, isConnected: true }
        : player
    );

    mode === "allforone" && sessionStorage.setItem("playerName", uniqueName);

    setGame({
      ...game,
      players: newPlayers,
    });
  };

  return (
    <DialogGeneric
      title={player.name}
      additionalAction={
        <Button
          variant="greenOutline"
          onClick={handleChangeName}
          disabled={
            (mode === "allforone" &&
              !isCurrentPlayer &&
              !player.name.includes("Player")) ||
            (player.name.includes("Player") && !avaliable)
          }
        >
          Save
        </Button>
      }
      subtitle={
        isCurrentPlayer
          ? "Fill up your infos"
          : " Here you can see your friends infos"
      }
      trigger={
        <UserCardDisplay
          {...{ player, reject, mode, index, isCurrentPlayer }}
        />
      }
    >
      {mode === "allforone" ? (
        <AllForOneInfos
          {...{ mode, isCurrentPlayer, avaliable, player, setName }}
        />
      ) : (
        <OneForAllInfos {...{ mode, player, setName, isCurrentPlayer }} />
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
  const isRestricted =
    (!isCurrentPlayer && !player.name.includes("Player")) ||
    (player.name.includes("Player") && !avaliable);
  return (
    <div
      className="flex flex-col px-4 
          gap-4"
    >
      <ShowWord disabled={isRestricted} word={player.word} />

      <Input
        disabled={isRestricted}
        placeholder={player.name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
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
        <ShowWord word={player.word} />
        <Input
          placeholder={player.name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </>
  );
};

const UserCardDisplay = ({
  player,
  reject,
  mode,
  isCurrentPlayer,
}: {
  player: TPlayers;
  reject?: boolean;
  mode?: string;
  isCurrentPlayer: boolean;
}) => {
  const { words } = useContext(GameContext).game.options;
  return (
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
      className="rounded-full w-[25vw] cursor-pointer lg:w-[15vw] @container flex items-center justify-center p-4 aspect-square"
    >
      <CardTitle className="opacity-60 whitespace-nowrap tracking-tight text-sm @[100px]:text-lg @[150px]:text-xl">
        {player.name}
        {!player.isAlive && (
          <>
            {determineRole(player.word, words) === "intruder"
              ? "👿"
              : player.word.length > 0
              ? "💀"
              : "👻"}
          </>
        )}
      </CardTitle>
    </Card>
  );
};
