import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function Rules() {
  return (
    <TabsContent className='container mx-auto px-4' value="rules">
  
        <CardHeader>
          <CardTitle className="text-3xl mx-auto">Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <RuleTitle>Goal</RuleTitle>
          <RuleText>Find the intruders!</RuleText>
          <RuleTitle>Gameplay</RuleTitle>
          <RuleText>
            In each turn, players express a synonym of their word and the other
            players have to identify the intruder.
          </RuleText>
          <RuleTitle>Game setup</RuleTitle>
          <RuleText>
            <RuleList>
              <RuleListItem>
                The game starts with a minimum of 4 players.
              </RuleListItem>
              <RuleListItem>The game can have up to 10 players.</RuleListItem>
            </RuleList>
          </RuleText>
          <RuleTitle>Game start</RuleTitle>
          <RuleText>
            <RuleList>
              <RuleListItem>
                Each player select a card on the board and write his name on it.
              </RuleListItem>
              <RuleListItem>
                Each player receives a word (except Mister White).
              </RuleListItem>
              <RuleListItem>
                The game starts when all players have received their word.
              </RuleListItem>
            </RuleList>
          </RuleText>
          <RuleTitle>Game turn: expression</RuleTitle>
          <RuleText>
            <RuleList>
              <RuleListItem>
                The game says who starts and the turn order is clockwise.
              </RuleListItem>
              <RuleListItem>
                Each player expresses a synonym of his word.
              </RuleListItem>
              <RuleExemple>
                if the word is &quot;apple&quot;, the player can say
                &quot;fruit&quot;.
              </RuleExemple>
            </RuleList>
          </RuleText>
          <RuleTitle>Game turn: vote</RuleTitle>
          <RuleText>
            <RuleList>
              <RuleListItem>
                After each player has expressed a synonym, the players vote for
                the intruder.
              </RuleListItem>
              <RuleListItem>
                The player with the most votes is eliminated.
              </RuleListItem>
              <RuleListItem>
                If there is a tie, the player who started the turn chooses who
                is eliminated.
              </RuleListItem>
            </RuleList>
          </RuleText>
          <RuleTitle>Game turn: Mister White</RuleTitle>
          <RuleText>
            <RuleList>
              <RuleListItem>
                If Mister White is eliminated, he can guess the word of the
                crewmates.
              </RuleListItem>
              <RuleListItem>
                If Mister White guesses the word of the crewmates, he wins.
              </RuleListItem>
            </RuleList>
          </RuleText>
          <RuleTitle>Game end</RuleTitle>
          <RuleText>
            <RuleList>
              <RuleListItem>
                The game ends when all intruders have been identified.
              </RuleListItem>
              <RuleListItem>
                The game ends when a Mister White has been identified and he
                guesses the word of the crewmates.
              </RuleListItem>
            </RuleList>
          </RuleText>
        </CardContent>
    </TabsContent>
  );
}

const RuleText = ({ children }: { children: React.ReactNode }) => (
  <div className="text-lg font-light font-serif">{children}</div>
);

const RuleTitle = ({ children, className }: { children: React.ReactNode, className?:string }) => (
  <>
  <Separator className='my-4 opacity-30' />
  <h2 className={cn("text-2xl  tracking-tight font-semibold text-center lg:text-start py-1 mx-auto", className)}>{children}</h2>
  </>
);

const RuleList = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc list-inside">{children}</ul>
);

const RuleListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="text-lg font-light font-serif">{children}</li>
);

const RuleExemple = ({ children }: { children: React.ReactNode }) => (
  <p className="text-lg font-light font-serif italic">{children}</p>
);
