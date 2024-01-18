import { TGame } from "@/app/types/types";

export function initGame(game: TGame) {
  // Créer ou mettre à jour les joueurs
  let updatedPlayers = [] as TGame["players"];
  for (let i = 0; i < game.options.joueurs; i++) {
    if (i < game.players.length) {
      // Mise à jour des joueurs existants
      updatedPlayers.push({
        ...game.players[i],
        word: "",
      });
    } else {
      // Création des nouveaux joueurs
      updatedPlayers.push({
        name: `Player ${i + 1}`,
        word: "",
        isAlive: true,
      });
    }
  }
  return updatedPlayers;
}
