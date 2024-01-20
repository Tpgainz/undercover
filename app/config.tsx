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
import { CreateGameHeader } from "@/components/config/CreateGameHeader";
import { JoinRoom } from "@/components/config/JoinRoom";

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
          <CreateGameHeader />
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
