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
import { ClipboardCopy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useContext, useState } from "react";

export default function GameConfig() {
  const { game, setGame } = useContext(GameContext);

  const { session, isSignedIn } = useSession();

  const options = game.options;

  return (
    <TabsContent className="flex  h-full justify-center" value="config">
      <Card
        className="relative mx-4 max-w-lg w-full
      "
      >
        <CardHeader className="flex flex-col  items-center">
          <CreateGameRoom sessionId={session?.id} isSignedIn={isSignedIn} />
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
        <Separator className="w-[80%] mx-auto opacity-75" />
        <JoinRoom sessionId={session?.id} />
      </Card>
    </TabsContent>
  );
}

export function CreateGameRoom({
  sessionId,
  isSignedIn,
}: {
  sessionId?: string;
  isSignedIn?: boolean;
}) {
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
      socket?.emit("edit_room", { roomId: sessionId, newRoomId: newRoomId });
      updateUrlParam("room", newRoomId);
    }
  }, [newRoomId, sessionId, socket, updateUrlParam]);

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
          socket?.emit("create_room", { roomId: sessionId });

          updateUrlParam("room", sessionId!);
        } else {
          router.push("/sign-in");
        }
      } else {
        setGame({ ...game, mode: "oneforall" });
        socket?.disconnect();
        updateUrlParam("room", "");
      }
    },
    [game, isSignedIn, router, sessionId, setGame, socket, updateUrlParam]
  );

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  const roomId = useSearchParams().get("room");

  const deduceHost = useCallback(() => {
    const isHost = sessionId === roomId;
    const isMultiAndotHost = isConnected && !isHost;

    return { isHost, isMultiAndotHost };
  }, [isConnected, sessionId, roomId]);

  return (
    <>
      {deduceHost().isMultiAndotHost && (
        <div className="absolute z-50 h-full rounded-xl flex flex-col gap-4 w-full items-center justify-center inset-0 bg-white/50 backdrop-blur-sm">
          <h1 className="text-2xl font-bold ">Waiting for host</h1>
          <p className="text-sm">Please wait for the host to start the game</p>
        </div>
      )}

      <div className="flex w-full  items-center justify-between space-y-2">
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
              defaultValue={sessionId}
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

export function JoinRoom({ sessionId }: { sessionId?: string }) {
  const { socket, isConnected } = useContext(GameContext);
  const [inputValue, setInputValue] = useState("");

  const handleJoinRoom = useCallback(() => {
    if (inputValue) {
      socket?.emit("join_room", { roomId: inputValue });
    }
  }, [inputValue, socket]);

  const roomId = useSearchParams().get("room");

  const deduceHost = useCallback(() => {
    const isHost = sessionId === roomId;
    const isMultiAndotHost = isConnected && !isHost;

    return { isHost, isMultiAndotHost };
  }, [isConnected, sessionId, roomId]);

  return (
    <>
      <CardHeader className="flex flex-col">
        <CardTitle
          className={
            !deduceHost().isMultiAndotHost ? "opacity-50 " : "opacity-100"
          }
        >
          Join Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            disabled={isConnected}
            defaultValue={deduceHost().isMultiAndotHost ? roomId ?? "" : ""}
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
