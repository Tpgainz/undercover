import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ShowWord = ({ word }: { word: string }) => {
  const [showWord, setShowWord] = useState(false);

  if (!word) {
    word = "You are Mister White";
  }

  return (
    <Button
      variant="secondary"
      onClick={() => {
        setShowWord(!showWord);
      }}
    >
      {showWord ? word : "Show word"}
    </Button>
  );
};
