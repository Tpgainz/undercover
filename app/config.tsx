"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { GameContext } from "@/lib/useGameContext";
import { useSession } from "@clerk/nextjs";
import { ClipboardCopy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { io } from "socket.io-client";

export default function GameConfig() {
  const { game, setGame } = useContext(GameContext);

  const options = game.options;

  return (
    <TabsContent
      className="flex items-center h-full justify-center"
      value="config"
    >
      <Card
        className=" mx-4 max-w-lg w-full
      "
      >
        <CardHeader className="flex flex-col  items-center">
          <CreateGameRoom />
        </CardHeader>
        <CardContent className="space-y-12">
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
                        options: { ...options, [key]: e.target.value },
                        state: "intro",
                      });
                    }}
                  />
                </div>
              );
            })}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export function Events({ events }: { events: string[] }) {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={index}>{event}</li>
      ))}
    </ul>
  );
}

export function CreateGameRoom() {
  const { session, isSignedIn } = useSession();
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
      socket?.emit("edit_room", { roomId: session?.id, newRoomId: newRoomId });
      updateUrlParam("room", newRoomId);
    }
  }, [newRoomId, session?.id, socket, updateUrlParam]);

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
          socket?.emit("create_room", { roomId: session?.id });

          updateUrlParam("room", session?.id);
        } else {
          router.push("/sign-in");
        }
      } else {
        setGame({ ...game, mode: "oneforall" });
        socket?.disconnect();
        updateUrlParam("room", "");
      }
    },
    [game, isSignedIn, router, session?.id, setGame, socket, updateUrlParam]
  );

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return (
    <>
      <div className="flex w-full items-center justify-between space-y-2">
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
              defaultValue={session?.id}
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
        </div>
      )}
    </>
  );
}
