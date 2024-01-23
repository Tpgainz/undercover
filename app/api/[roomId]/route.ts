import { globalGames } from "@/server/data";

export default function GET({ params }: { params: { roomId: string } }) {
  return globalGames[params.roomId];
}
