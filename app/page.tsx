"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { GameContext } from "@/lib/useGameContext";
import Rules from "./rules";
import GameConfig from "./config";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import GameIntro from "./game/intro";
import GameRound from "./game/game";
import { GameEnd } from "./game/end";

/*
 * This is a game where each player has a word and the objective is to find the intruders.
 * For example, in a game of 10 players:
 * - 5 players have the same word
 * - 3 players have a different but related word (e.g., "yoghourt", "milk")
 * - 2 players have no word
 *
 * In each turn, players express a synonym of their word and the other players have to identify the intruder.
 * The intruder is the player who has a different word.
 * The player who has no word is referred to as 'Mister White'.
 */

export default function Home() {
  return (
    <Tabs defaultValue="rules" className="w-full flex  flex-col bganimate h-[100dvh] bg-gradient-to-r from-primary/70 to-primary/80
    ">
      <TabsList className="w-full flex bg-transparent justify-around">
        <TabsTrigger value="rules">Rules</TabsTrigger>
        <TabsTrigger value="config">Config</TabsTrigger>
        <TabsTrigger value="game">Game</TabsTrigger>
      </TabsList>
      <ScrollArea className="my-auto w-full">
        <ScrollBar />
        <Rules />
        <GameConfig />
        <Game />
      </ScrollArea>
    </Tabs>
  );
}

const GameFlow = {
  intro: GameIntro,
  playing: GameRound,
  end: GameEnd,
};

function Game() {
  const { state } = useContext(GameContext).game;
  console.log(state, "state");
  return <TabsContent value="game">{GameFlow[state]()}</TabsContent>;
}
