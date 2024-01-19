import { TGame } from "@/app/types/types";

export const determineRole = (
  word: string,
  gameWords: TGame["options"]["words"]
) => {
  if (word === gameWords[0]) {
    return "citizen";
  } else if (word === gameWords[1]) {
    return "intruder";
  } else {
    return "M White";
  }
};
