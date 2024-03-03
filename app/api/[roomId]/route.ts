import { globalGames } from "@/server/data";

export function GET(
  req: Request,
  res: Response,
  { params }: { params: { roomId: string } }
) {
  if (!params) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }
  const roomId = params.roomId;
  if (!roomId) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  if (!globalGames[roomId]) {
    return Response.json({ error: "Party data not found" }, { status: 404 });
  }

  return Response.json(globalGames[roomId].state);
}
