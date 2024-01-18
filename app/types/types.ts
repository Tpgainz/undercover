import { TSocket } from "@/lib/socket";

export type TPlayers = {
  name: string;
  word: string;
  isAlive: boolean;
};

export type TGame = {
  players: TPlayers[];
  options: TGameOptions;
  state: TGameState;
  mode?: "oneforall" | "allforone" | undefined;
};

export type TGameOptions = {
  joueurs: number;
  misterWhite: number;
  intrus: number;
  words: string[];
};

export type TGameContext = {
  game: TGame;
  setGame: (game: TGame) => void;
  socket: TSocket | undefined;
  isConnected: boolean;
};

type TGameState = "intro" | "playing" | "end";
