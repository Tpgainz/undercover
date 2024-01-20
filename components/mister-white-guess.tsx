import { GameContext } from "@/lib/useGameContext";
import { useState, useContext, useEffect } from "react";
import { DialogGeneric } from "./dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const MisterWhiteGuess = ({
  correctWord,
  onClose,
  setGuessingPlayer,
}: {
  onClose: () => void;
  correctWord: string;
  setGuessingPlayer: (index: number | null) => void;
}) => {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const { game, setGame } = useContext(GameContext);

  const handleGuessSubmit = (guess: string) => {
    if (guess.toLowerCase() === correctWord.toLowerCase()) {
      setGame({
        ...game,
        state: "end",
      });
      onClose();
    } else {
      setMessage(`Loupé !`);
      const newTimer = setTimeout(() => {
        setMessage("");
        setGuessingPlayer(null);
        onClose();
      }, 2000);
      setTimer(newTimer);
    }
  };

  // Nettoyer le timer si le composant est démonté
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <div className="flex w-full flex-col gap-4 px-4">
      <h1 className="mx-auto  p-2 rounded-md text-center text-2xl">
        Vous avez trouvé un Mister White
      </h1>

      <p className="text-center text-lg">
        Il a maintenant une chance de se rattraper en devinant le mot et
        décrocher la victoire
      </p>

      <DialogGeneric
        title="Your Guess"
        subtitle="Enter the word you think it is"
        trigger={
          <Button size="lg" className="md:mx-auto">
            Guess
          </Button>
        }
      >
        {message ? (
          <p className="text-red-500 text-center text-4xl">{message}</p>
        ) : (
          <div className="flex flex-col gap-4 px-4">
            <Input value={guess} onChange={(e) => setGuess(e.target.value)} />
            <Button
              onClick={() => {
                handleGuessSubmit(guess), onClose;
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </DialogGeneric>
    </div>
  );
};
