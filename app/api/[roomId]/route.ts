import { globalGames } from "@/server/data";

export default function GET(
  req: Request,
  res: Response,
  { params }: { params: { roomId: string } }
) {
  if (!globalGames[params.roomId]) {
    return new Response(
      JSON.stringify({
        message: "Room not found",
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify(globalGames[params.roomId]), {
    headers: { "content-type": "application/json" },
  });
}
