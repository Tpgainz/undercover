import { TGame } from "@/app/types/types";

const areAllintrudersDead = (
    game: TGame
) => {
    
    const intruders = game.players.filter(
      (player) => player.word === game.options.words[1]
    );
    const intrudersAlive = intruders.filter((player) => player.isAlive);
    return intrudersAlive.length === 0;
  }
  const areAllCrewmatesDead = (
    game: TGame
  ) => {
    const crewmates = game.players.filter(
      (player) => player.word === game.options.words[0]
    );
    const crewmatesAlive = crewmates.filter((player) => player.isAlive);
    return crewmatesAlive.length === 0;
  };

  export {areAllintrudersDead, areAllCrewmatesDead}