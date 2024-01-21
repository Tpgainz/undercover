import { GameContext } from "@/lib/useGameContext";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useContext, useCallback } from "react";
import { Lobby } from "../lobby";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ClipboardCopy } from "lucide-react";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export function CreateGameHeader() {
  const { session, isSignedIn } = useSession();
  const hostId = session?.user.id;
  const router = useRouter();
  const [newRoomId, setNewRoomId] = useState("");
  const { socket, isConnected, game, setGame } = useContext(GameContext);

  const updateUrl = useCallback((roomId: string | null) => {
    const url = new URL(window.location.href);
    roomId
      ? url.searchParams.set("room", roomId)
      : url.searchParams.delete("room");
    window.history.pushState({}, "", url);
  }, []);

  const handleRoomChange = useCallback(
    (roomId: string) => {
      if (roomId) {
        socket?.emit("edit_room", { roomId: hostId, newRoomId: roomId });
        updateUrl(roomId);
      }
    },
    [hostId, socket, updateUrl]
  );

  const toggleGameMode = useCallback(
    (checked: boolean) => {
      if (checked) {
        if (isSignedIn) {
          socket?.connect();
          setGame({ ...game, mode: "allforone" });
          const roomId =
            hostId ?? `room_${Math.random().toString(36).substr(2, 9)}`;
          socket?.emit("create_room", { roomId });
          updateUrl(roomId);
        } else {
          router.push("/sign-in");
        }
      } else {
        setGame({ ...game, mode: "oneforall" });
        socket?.disconnect();
        updateUrl(null);
      }
    },
    [game, isSignedIn, router, hostId, setGame, socket, updateUrl]
  );

  return (
    <>
      <div className="flex w-full items-center justify-between space-y-2">
        <CardTitle>Game Config</CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            defaultChecked={false}
            checked={isConnected}
            onCheckedChange={toggleGameMode}
            id="game-mode"
          />
          <Label htmlFor="game-mode">
            {isConnected ? "All for one" : "One for all"}
          </Label>
        </div>
      </div>

      <div
        className={`w-full flex py-3 gap-2 ${
          isConnected ? "visible" : "invisible"
        }`}
      >
        <div className="relative w-full">
          <Input disabled defaultValue={hostId} />
          <ClipboardCopy
            size={20}
            onClick={() =>
              navigator.clipboard.writeText(window.location.href.split("=")[1])
            }
            className="absolute cursor-pointer hover:opacity-65 inset-0 m-auto mr-2"
          />
        </div>
        <Button onClick={() => handleRoomChange(newRoomId)}>Edit</Button>
        {isConnected && <Lobby />}
      </div>
    </>
  );
}
