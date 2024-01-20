import { TGame } from "@/app/types/types";

export function createPlayers(game: TGame) {
  const totalPlayers = game.players.length;
  console.log("totalPlayers", totalPlayers);
  const maxSpecialRoles = game.options.misterWhite + game.options.intrus;

  if (totalPlayers - 1 < maxSpecialRoles) {
    console.error(
      "Le nombre total de joueurs est inférieur à la somme de misterWhite et intrus."
    );
    //Build an array of players with the minimum number of players
    const playersNumber = game.options.intrus + game.options.misterWhite + 1;
    return Array.from(Array(playersNumber).keys()).map((i) => ({
      name: "Player " + (i + 1),
      word: "",
      isAlive: true,
    }));
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
