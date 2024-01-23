import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ShowWord = ({
  word,
  disabled = false,
}: {
  word: string;
  disabled?: boolean;
}) => {
  const [showWord, setShowWord] = useState(false);

  if (!word) {
    word = "You are Mister White";
  }

  return (
    <Button
      disabled={disabled}
      variant="secondary"
      onClick={() => {
        setShowWord(!showWord);
      }}
    >
      {showWord ? word : "Show word"}
    </Button>
  );
};
