import { globalGames } from "@/server/data";

export default function GET(
  req: Request,
  res: Response,
  { params }: { params: { roomId: string } }
) {
  if (!globalGames[params.roomId]) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  return Response.json(globalGames[params.roomId].state);
}
