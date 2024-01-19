import { Socket } from "socket.io";
import { schemas } from "@/server/shared/schema";
import unsafeActions from "./shared/emits";

export type ExtractDataTypes<T> = {
  [K in keyof T]: T[K] extends (socket: Socket, data: infer D) => any
    ? D
    : never;
};

type TUnsafeActions = typeof unsafeActions;

export type UnsafeKey = keyof TUnsafeActions;

export type ActionDataTypes<T extends UnsafeKey> = ExtractDataTypes<
  Pick<TUnsafeActions, T>
>[T];

//From the schema to avoid circular dependency

export type InferedDataTypes<T extends keyof typeof schemas> = ReturnType<
  typeof schemas[T]["parse"]
>;
