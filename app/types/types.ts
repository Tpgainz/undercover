import { TSocket } from "@/lib/socket";
import { schemas } from "@/server/shared/schema";
import { z } from "zod";

const { game, emit, gameContext, gameOptions, players } = schemas;

export type TPlayers = z.infer<typeof players>;

export const Colors: Record<string, string> = {
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  yellow: "#FFFF00",
  purple: "#FF00FF",
  orange: "#FFA500",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  black: "#000000",
  white: "#FFFFFF",
  grey: "#808080",
  cyan: "#00FFFF",
} as const;

export type TGame = z.infer<typeof game>;

export type TGameOptions = z.infer<typeof gameOptions>;

export type TGameContext = z.infer<typeof gameContext> & {
  setGame: (game: TGame) => void;
  socket: TSocket | undefined;
};
