"use client";
import { TGame, TGameContext } from "@/app/types/types";
import { createContext, useEffect, useState } from "react";

const wordsList = [
  ["yoghourt", "milk"],
  ["dog", "cat"],
  ["car", "bike"],
  ["house", "apartment"],
  ["mouse", "rat"],
  ["apple", "orange"],
  ["banana", "pear"],
  ["chocolate", "vanilla"],
  ["chicken", "turkey"],
  ["coffee", "tea"],
  ["computer", "phone"],
  ["cow", "horse"],
  ["dolphin", "whale"],
  ["duck", "goose"],
  ["elephant", "giraffe"],
  ["fish", "shark"],
  ["fox", "wolf"],
  ["frog", "toad"],
  ["lion", "tiger"],
  ["monkey", "gorilla"],
  ["penguin", "seal"],
  ["pig", "sheep"],
  ["rabbit", "squirrel"],
  ["snake", "lizard"],
  ["spider", "scorpion"],
  ["turtle", "tortoise"],
  ["wolf", "coyote"],
  ["zebra", "horse"],
];

export function pickRandomWords(): string[] {
  const randomIndex = Math.floor(Math.random() * wordsList.length);
  return wordsList[randomIndex];
}

export const cachedGame = () => {
  if (typeof window === "undefined") {
    return;
  }
  console.log(window.sessionStorage.getItem("game"), "cachedGame");
  return (window.sessionStorage.getItem("game") &&
    JSON.parse(sessionStorage.getItem("game")!)) as TGame;
};

const defaultGame = cachedGame() ?? {
  players: [],
  options: {
    joueurs: 5,
    misterWhite: 1,
    intrus: 2,
    words: pickRandomWords(),
  },
  state: "intro",
};

export const GameContext = createContext<TGameContext>({
  game: defaultGame,
  setGame: () => {},
});

function initGame(game: TGame) {
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

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState<TGame>(defaultGame);
  useEffect(() => {
    // Cette fonction est appelée uniquement lorsque les options de jeu changent.
    setGame((prevGame) => {
      const players = initGame(prevGame);
      const updatedPlayers = newPlayersRoles({ ...prevGame, players });
      return { ...prevGame, players: updatedPlayers };
    });
  }, [
    game.options.joueurs,
    game.options.misterWhite,
    game.options.intrus,
    game.options.words,
  ]); // Les propriétés spécifiques des options de jeu

  useEffect(() => {
    sessionStorage.setItem("game", JSON.stringify(game));
  }, [game]);

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
};

export function newPlayersRoles(game: TGame) {
  if (!game.players.length) {
    return [];
  }

  const totalPlayers = game.players.length;
  const maxSpecialRoles =
    Number(game.options.misterWhite) + Number(game.options.intrus);

  if (totalPlayers < maxSpecialRoles) {
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
