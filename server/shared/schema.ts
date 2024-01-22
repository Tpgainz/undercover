import { z } from "zod";

const createRoomSchema = z.object({
  roomId: z.string(),
});

const editRoomSchema = z.object({
  roomId: z.string(),
  newRoomId: z.string(),
});

const joinRoomSchema = z.object({
  roomId: z.string(),
});

const emitSchema = z.object({
  event: z.string(),
  data: z.any(),
});

const playerSchema = z.object({
  name: z.string(),
  word: z.string(),
  isAlive: z.boolean(),
  isConnected: z.boolean().optional(),
});

const gameOptionsSchema = z.object({
  joueurs: z.number(),
  misterWhite: z.number(),
  intrus: z.number(),
  words: z.array(z.string()),
});

const gameSchema = z.object({
  players: z.array(playerSchema),
  options: gameOptionsSchema,
  state: z.union([z.literal("intro"), z.literal("playing"), z.literal("end")]),
  mode: z.union([z.literal("oneforall"), z.literal("allforone")]).optional(),
  roomId: z.string().optional(),
});

const TGameContextSchema = z.object({
  game: gameSchema,
  // Omettre setGame et socket car Zod ne gère pas bien les fonctions ou les instances de classe
  isConnected: z.boolean(),
});

export const schemas = {
  create_room: createRoomSchema,
  edit_room: editRoomSchema,
  join_room: joinRoomSchema,
  emit: emitSchema,
  players: playerSchema,
  gameOptions: gameOptionsSchema,
  game: gameSchema,
  gameContext: TGameContextSchema,
} as const;
