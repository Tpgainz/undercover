import { Socket } from "socket.io";
import { InferedDataTypes } from "../types";
import { inferData } from "../utils/infer-data";

const Actions = {
  create_room: (socket: Socket, data: InferedDataTypes<"create_room">) => {
    const { roomId } = inferData("create_room", data);
    socket.join(roomId);
    socket.emit("room_created", { roomId: roomId });
    console.log("room created", roomId);
  },

  edit_room: (socket: Socket, data: InferedDataTypes<"edit_room">) => {
    const { roomId, newRoomId } = inferData("edit_room", data);
    socket.leave(roomId);
    socket.join(newRoomId ?? roomId);
    socket.emit("room_edited", { oldRoomId: roomId, newRoomId });
    console.log("room edited", roomId, newRoomId);
  },
  join_room: (socket: Socket, data: InferedDataTypes<"join_room">) => {
    const { roomId } = inferData("join_room", data);
    socket.join(roomId);
    socket.emit("room_joined", { roomId });
    console.log("room joined", roomId);
  },
  emit: (socket: Socket, data: InferedDataTypes<"emit">) => {
    const { event, data: eventData } = inferData("emit", data);
    socket.emit(event, eventData);
    console.log("emitted", event, eventData);
  },
} as const;

export default Actions;
