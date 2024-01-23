import { TPlayers } from "@/app/types/types";

export const getUniqueName = (proposedName: string, players: TPlayers[]) => {
  let uniqueName = proposedName;
  let count = 1;

  // Vérifie si le nom proposé existe déjà et ajuste le nom avec un index
  while (players.some((player) => player.name === uniqueName)) {
    uniqueName = `${proposedName} (${count})`;
    count++;
  }

  return uniqueName;
};
