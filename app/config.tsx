"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { GameContext } from "@/lib/useGameContext";
import { useSession } from "@clerk/nextjs";
import { ClipboardCopy, Sword, Swords } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useContext, useEffect, useState } from "react";
import { TGame } from "./types/types";
import { DialogGeneric } from "@/components/dialog";

export default function GameConfig() {
  const { setGame, game } = useContext(GameContext);

  const options = game.options;

  return (
    <TabsContent className="flex  h-full justify-center" value="config">
      <Card
        className="relative mx-4 max-w-lg w-full
      "
      >
        <CardHeader className="flex flex-col  items-center">
          <CreateGameRoom />
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.keys(options)
            .filter((key) => key !== "words")
            .map((key) => {
              const optionKey = key as keyof typeof options;
              return (
                <div key={key} className="flex flex-col gap-2">
                  <Label htmlFor={key}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .toUpperCase()}
                  </Label>
                  <Input
                    min={
                      key === "joueurs"
                        ? game.options.misterWhite + game.options.intrus + 1
                        : undefined
                    }
                    type="number"
                    defaultValue={options[optionKey]}
                    id={key}
                    onChange={(e) => {
                      //Delete any non-alphanumeric characters
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z0-9]/g,
                        ""
                      );
                      setGame({
                        ...game,
                        options: {
                          ...game.options,
                          [optionKey]: Number(e.target.value),
                        },
                      });
                    }}
                  />
                </div>
              );
            })}
        </CardContent>
        <Separator className="w-[80%] mx-auto opacity-75" />
        <JoinRoom />
      </Card>
    </TabsContent>
  );
}

export function CreateGameRoom() {
  const { session, isSignedIn } = useSession();
  const hostId = session?.user.id;
  const router = useRouter();
  const [newRoomId, setNewRoomId] = useState("");
  const { socket, isConnected, game, setGame } = useContext(GameContext);

  const updateUrlParam = useCallback((key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.pushState({}, "", url);
  }, []);

  const handleEditRoom = useCallback(() => {
    if (newRoomId) {
      socket?.emit("edit_room", { roomId: hostId, newRoomId: newRoomId });
      updateUrlParam("room", newRoomId);
    }
  }, [newRoomId, hostId, socket, updateUrlParam]);

  const handlenewRoomIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewRoomId(e.target.value);
    },
    []
  );

  const handleSwitchChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        if (isSignedIn) {
          setGame({ ...game, mode: "allforone" });
          socket?.connect();
          socket?.emit("create_room", { roomId: hostId });

          updateUrlParam("room", hostId!);
        } else {
          router.push("/sign-in");
        }
      } else {
        setGame({ ...game, mode: "oneforall" });
        socket?.disconnect();
        updateUrlParam("room", "");
      }
    },
    [game, isSignedIn, router, hostId, setGame, socket, updateUrlParam]
  );

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  console.log(game);

  return (
    <>
      <div className="flex w-full  items-center relative justify-between space-y-2">
        <CardTitle>Game Config</CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isConnected}
            onCheckedChange={handleSwitchChange}
            id="game-mode"
          />
          <Label id="game-mode" htmlFor="game-mode">
            {isConnected ? "All for one" : "One for all"}
          </Label>
        </div>
      </div>

      {isConnected && (
        <div className="flex w-full py-3 gap-2">
          <div className="relative w-full">
            <Input
              disabled
              defaultValue={hostId}
              onChange={handlenewRoomIdChange}
            />
            <ClipboardCopy
              size={20}
              onClick={copyToClipboard}
              className="absolute cursor-pointer
               hover:opacity-65 inset-0 m-auto mr-2"
            />
          </div>
          <Button onClick={handleEditRoom}>Edit</Button>
          {isConnected && <WaitingRoom />}
        </div>
      )}
    </>
  );
}

export function JoinRoom() {
  const { socket, isConnected } = useContext(GameContext);
  const [inputValue, setInputValue] = useState("");
  const { session } = useSession();

  const handleJoinRoom = useCallback(() => {
    if (inputValue) {
      socket?.emit("join_room", { roomId: inputValue });
    }
  }, [inputValue, socket]);

  const roomId = useSearchParams().get("room");

  const lobby = useCallback(() => {
    const isHost = session?.user.id === roomId;
    const isGuest = isConnected && !isHost;

    return { isHost, isGuest };
  }, [isConnected, roomId, session]);

  return (
    <>
      <CardHeader className="flex flex-col">
        <CardTitle className={isConnected ? "opacity-50 " : "opacity-100"}>
          Join Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            disabled={isConnected}
            defaultValue={lobby().isGuest ? roomId ?? "" : ""}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Room ID or game URL"
          />
          <Button onClick={handleJoinRoom} disabled={isConnected}>
            Join
          </Button>
        </div>
      </CardContent>
    </>
  );
}

export function WaitingRoom() {
  const { game } = useContext(GameContext);

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
          <CardTitle>Waiting Room</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2">
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

                <p className="truncate ...">{player.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DialogGeneric>
  );
}
