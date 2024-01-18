"use client";

import { GameContext } from "@/lib/useGameContext";
import { Plug, Unplug } from "lucide-react";
import { useContext } from "react";
import { Button } from "./ui/button";

export function ConnectionState() {
  const { socket } = useContext(GameContext);
  const connected = socket?.connected;
  return (
    <Button
      onClick={() => {
        connected ? socket?.disconnect() : socket?.connect();
      }}
      size="icon"
      className="fixed bottom-0 right-0 mb-4 mr-16 z-50"
      variant={connected ? "greenOutline" : "redOutline"}
    >
      {connected ? <Plug /> : <Unplug />}
    </Button>
  );
}
