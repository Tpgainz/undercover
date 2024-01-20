import { TGame } from "@/app/types/types";

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

const cachedGame = () => {
  if (typeof window === "undefined") {
    return;
  }

  return (window.sessionStorage.getItem("game") &&
    JSON.parse(sessionStorage.getItem("game")!)) as TGame;
};

export function pickRandomWords(): string[] {
  const randomIndex = Math.floor(Math.random() * wordsList.length);
  return wordsList[randomIndex];
}

export const defaultGame = cachedGame() ?? {
  players: [],
  options: {
    joueurs: 5,
    misterWhite: 1,
    intrus: 2,
    words: pickRandomWords(),
  },
  state: "intro",
  mode: "oneforall",
};
