import { GameContext } from "@/lib/useGameContext";
import { useSession } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useContext, useState, useCallback, useEffect } from "react";
import { Button } from "../ui/button";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { TGame } from "@/app/types/types";

export function JoinRoom() {
  const { socket, isConnected, setGame } = useContext(GameContext);
  const [inputValue, setInputValue] = useState("");
  const { session } = useSession();

  const handleJoinRoom = useCallback(() => {
    if (inputValue) {
      socket?.connect();
      console.log("Joining room", inputValue);
      socket?.emit("join_room", { roomId: inputValue });
    }
  }, [inputValue, socket]);

  useEffect(() => {
    if (!inputValue) return;
    async function fetchRoom() {
      const res = await fetch(`/api/${inputValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as TGame;
      console.log("Room data", data);
      setGame(data);
    }
    fetchRoom();
  }, [handleJoinRoom]);

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
            onChange={(e) => {
              setInputValue(e.target.value),
                window.history.replaceState({}, "", `?room=${e.target.value}`);
            }}
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
