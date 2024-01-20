import { GameContext } from "@/lib/useGameContext";
import { useSession } from "@clerk/nextjs";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ClipboardCopy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useContext, useCallback } from "react";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Lobby } from "../lobby";

export function CreateGameHeader() {
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

      <div
        className={`w-full flex ${isConnected ? "visible" : "invisible"}
      
       py-3 gap-2`}
      >
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
        {isConnected && <Lobby />}
      </div>
    </>
  );
}
