import "@assets/styles/Rewind.scss";
import { Heading } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";
import { getAmountIntlString } from "../../utils/Intl";
import { getPlayerWinCount, getPlayerWinRate } from "../../utils/Player";

type OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

export function RewindPage2({ viewer, games }: OwnProps) {
  const winCount = getPlayerWinCount(viewer, games);
  const winRate = getPlayerWinRate(viewer, games);

  function getWinRateMessage(): string {
    if (winRate > 0 && winRate <= 0.1) {
      return "We'll get those numbers up next year!";
    }

    if (winRate > 0.1 && winRate <= 0.2) {
      return "Be more rutheless";
    }

    if (winRate > 0.2 && winRate <= 0.3) {
      return "You did a great job!";
    }

    return "Leave some for the rest of the pod!";
  }

  return (
    <div className="Page2 w-full h-full">
      <Heading
        className="RewindHeading Heading1 w-full"
        align="center"
        size="8"
      >
        Playing these games is fun, it brings us closer, and creates
        unforgettable memories,
      </Heading>
      <Heading
        className="RewindHeading Heading2 w-full"
        align="center"
        size="8"
      >
        But that's not what's important,
      </Heading>
      <Heading
        className="RewindHeading Heading3 w-full"
        align="center"
        size="9"
      >
        Winning is.
      </Heading>
      <Heading
        className="RewindHeading Heading4 w-full"
        align="center"
        size="8"
      >
        And you've done your fair share of winning this year with...
      </Heading>
      <Heading
        className="RewindHeading Heading5 w-full"
        align="center"
        size="9"
      >
        <b>
          {winCount} {getAmountIntlString(winCount, "win", "wins")}!
        </b>
      </Heading>
      <Heading
        className="RewindHeading Heading6 w-full"
        align="center"
        size="6"
      >
        That's <b>{Math.round(winRate * 100)}%</b> of all the games you played.
      </Heading>
      <Heading
        id="AnimationEndTrigger"
        className="RewindHeading Heading7 w-full"
        align="center"
        size="8"
      >
        {getWinRateMessage()}
      </Heading>
    </div>
  );
}
