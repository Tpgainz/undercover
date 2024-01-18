import { TGame } from "@/app/types/types";

export function createPlayers(game: TGame) {
  if (!game.players.length) {
    return [];
  }

  const totalPlayers = game.players.length;
  const maxSpecialRoles =
    Number(game.options.misterWhite) + Number(game.options.intrus);

  if (totalPlayers - 1 < maxSpecialRoles) {
    console.error(
      "Le nombre total de joueurs est inférieur à la somme de misterWhite et intrus."
    );
    return [];
  }

  // Création d'une liste de rôles basée sur les options de jeu
  const roles = [];
  for (let i = 0; i < game.options.misterWhite; i++) {
    roles.push("");
  }
  for (let i = 0; i < game.options.intrus; i++) {
    roles.push(game.options.words[1]); // Second mot pour les intrus
  }
  for (let i = roles.length; i < totalPlayers; i++) {
    roles.push(game.options.words[0]); // Premier mot pour les crewmates
  }

  // Mélanger le tableau des rôles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  // Assigner les rôles mélangés aux joueurs
  for (let i = 0; i < totalPlayers; i++) {
    game.players[i].word = roles[i];
    game.players[i].isAlive = true;
  }
  return game.players;
}
