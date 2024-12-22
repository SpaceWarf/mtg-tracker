import "@assets/styles/Rewind.scss";
import { Heading } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";
import { getAmountIntlString } from "../../utils/Intl";
import {
  getPlayerGamesStarted,
  getPlayerGamesStartedAndWon,
  getPlayerGamesStartedRate,
  getPlayerGamesStartedToWinRate,
  getPlayerGrandSlamCount,
  getPlayerSolRingAndWonCount,
  getPlayerSolRingCount,
  getPlayerSolRingRate,
  getPlayerSolRingToWinRate,
} from "../../utils/Player";

type OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

export function RewindPage4({ viewer, games }: OwnProps) {
  const startCount = getPlayerGamesStarted(viewer, games);
  const startRate = getPlayerGamesStartedRate(viewer, games);
  const startToWinCount = getPlayerGamesStartedAndWon(viewer, games);
  const startToWinRate = getPlayerGamesStartedToWinRate(viewer, games);

  const solRingCount = getPlayerSolRingCount(viewer, games);
  const solRingRate = getPlayerSolRingRate(viewer, games);
  const solRingToWinCount = getPlayerSolRingAndWonCount(viewer, games);
  const solRingToWinRate = getPlayerSolRingToWinRate(viewer, games);

  const grandSlamCount = getPlayerGrandSlamCount(viewer, games);

  function getStartEndLabel(): string {
    if (startRate < 0.1) {
      return "You should really practice those dice throws for the New Year.";
    }

    if (startRate > 0.3) {
      return "Are you sure those dice of yours aren't loaded?";
    }

    return "A solid dice rolling average.";
  }

  function getSolRingEndLabel(): string {
    if (solRingRate < 0.1) {
      return "Did you forget to include one when you built your decks?";
    }

    if (solRingRate > 0.25) {
      return "Are you sure you only have a single copy in there?";
    }

    if (solRingToWinRate === 0) {
      return "If Sol Ring can't carry you to victory, I don't know what will!";
    }

    return "Nothing to bat an eye about.";
  }

  return (
    <div className="Page4 w-full h-full p-2">
      <Heading
        className="RewindHeading Heading1 w-full"
        align="center"
        size="7"
      >
        Here's some other stats that might interest you
      </Heading>
      <Heading className="RewindHeading Heading2" align="center" size="4">
        You started {startCount}{" "}
        {getAmountIntlString(startCount, "game", "games")},{" "}
        {Math.round(startRate * 100)}% of all your games, and converted{" "}
        {startToWinCount} of those starts into wins (a rate of{" "}
        {Math.round(startToWinRate * 100)}%). {getStartEndLabel()}
      </Heading>
      <Heading className="RewindHeading Heading3" align="center" size="4">
        You first turn was blessed by a Sol Ring {solRingCount}{" "}
        {getAmountIntlString(solRingCount, "time", "times")} and led to a win{" "}
        {solRingToWinCount} of those times! That's a{" "}
        {Math.round(solRingRate * 100)}% Sol Ring rate, and a win conversion
        rate of {Math.round(solRingToWinRate * 100)}%. {getSolRingEndLabel()}
      </Heading>

      {grandSlamCount > 0 ? (
        <Heading
          id="AnimationEndTrigger"
          className="RewindHeading Heading4"
          align="center"
          size="4"
        >
          You are one of the lucky (or skilled) few who managed to get a Grand
          Slam this year! You had {grandSlamCount}{" "}
          {getAmountIntlString(grandSlamCount, "game", "games")} where you
          started, played a Sol Ring on your first turn, and won. Talk about
          hitting it out of the park.
        </Heading>
      ) : (
        <Heading
          id="AnimationEndTrigger"
          className="RewindHeading Heading4"
          align="center"
          size="4"
        >
          Unfortunately, there was no Grand Slam for you this year, but keep at
          it and it will come!
        </Heading>
      )}
    </div>
  );
}
