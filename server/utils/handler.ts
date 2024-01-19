import { Socket } from "socket.io";
import { ActionDataTypes, UnsafeKey } from "../types";
import unsafeActions from "../shared/emits";

export const socketHandler = (socket: Socket) => {
  console.log("A user connected");

  Object.keys(unsafeActions).forEach((action) => {
    socket.on(action, (data) =>
      delegateAction(socket, action as keyof ActionDataTypes<UnsafeKey>, data)
    );
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

const delegateAction = (socket: Socket, actionType: UnsafeKey, data: any) => {
  const action = unsafeActions[actionType];
  if (action) {
    ensureData(socket, () => action(socket, data));
  } else {
    console.error("No handler found for action:", actionType);
  }
};

const ensureData = (socket: Socket, action: () => void) => {
  try {
    action();
  } catch (error) {
    console.error("Error during action:", error);
    socket.emit("action_error", {
      message: "An error occurred during the action.",
    });
  }
};
