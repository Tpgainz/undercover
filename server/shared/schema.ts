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

export const schemas = {
  create_room: createRoomSchema,
  edit_room: editRoomSchema,
  join_room: joinRoomSchema,
  emit: emitSchema,
} as const;
