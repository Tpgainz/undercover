import { useState } from "react";
import { Button } from "./ui/button";

const NotHostConfig = ({ shareLink }: { shareLink: string }) => {
  const [copied, setCopied] = useState(false);

  const CopyAnimation = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex absolute inset-0 flex-col z-20 justify-center backdrop-blur-2xl rounded-md items-center gap-4">
      <h1 className="text-2xl text-center">
        You are not the host of this room, you can&apos;t change the game
        settings.
      </h1>
      <h2 className="text-xl text-center">
        You can still play the game though and invite your friends!
      </h2>
      <Button onClick={CopyAnimation}>
        {copied ? "Copied to clipboard!" : "Copy invite link"}
      </Button>
    </div>
  );
};

export default NotHostConfig;
