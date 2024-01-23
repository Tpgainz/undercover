"use client";
import { GameContext } from "@/lib/useGameContext";
import { useContext } from "react";

import { TabsContent } from "../../components/ui/tabs";
import GameEnd from "./end";
import GameIntro from "./intro";
import GameBoard from "./board";

const GameFlow = {
  intro: GameIntro,
  playing: GameBoard,
  end: GameEnd,
};

export function Game() {
  const { game } = useContext(GameContext);
  const { state } = game;
  return <TabsContent value="game">{GameFlow[state]()}</TabsContent>;
}
