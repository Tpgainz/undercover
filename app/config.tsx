"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { GameContext } from "@/lib/useGameContext";
import { useContext } from "react";

export default function GameConfig() {
  const { game, setGame } = useContext(GameContext);

  const options = game.options;


  return (
    <TabsContent className='flex items-center justify-center' value="config">
      <Card
        className=" mx-4 max-w-lg w-full
      "
      >
        <CardHeader>
          <CardTitle>Game Config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-12">
          {Object.keys(options)
            .filter((key) => key !== "words")
            .map((key) => {
              const optionKey = key as keyof typeof options;
              return (
                <div key={key} className="flex flex-col gap-2">
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    defaultValue={options[optionKey]}
                    id={key}
                   
                    onChange={(e) =>
                      setGame({
                        ...game,
                        options: { ...options, [key]: e.target.value },
                        state: "intro",
                      })
                    }
                  />
                </div>
              );
            })}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
