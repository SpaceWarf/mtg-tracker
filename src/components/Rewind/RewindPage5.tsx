import "@assets/styles/Rewind.scss";
import { Heading } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";
import { getAllGamesForPlayerAndDeck } from "../../utils/Game";
import { getAmountIntlString } from "../../utils/Intl";
import { getPlayerDecksPlayedMap } from "../../utils/Player";

type OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

export function RewindPage5({ viewer, games, decks }: OwnProps) {
  const deckMap = getPlayerDecksPlayedMap(viewer, games);
  const mostPlayedDeck = getMostPlayedDeck();
  const mostPlayedDeckPlayCount = getMostPlayedDeckPlayCount();
  const gamesPlayedWithDeck = getAllGamesForPlayerAndDeck(
    viewer,
    mostPlayedDeck,
    games
  );
  const winsWithDeck = gamesPlayedWithDeck.filter((games) => games.won).length;

  function getMostPlayedDeckId(): string {
    const [id] = [...deckMap.entries()].reduce((a, e) => (e[1] > a[1] ? e : a));
    return id;
  }

  function getMostPlayedDeckPlayCount(): number {
    return Math.max(...deckMap.values());
  }

  function getMostPlayedDeck(): DbDeck {
    const id = getMostPlayedDeckId();
    const deck = decks.find((deck) => deck.id === id);

    if (deck) {
      return deck;
    }

    throw new Error(`Error: Could not find decks with id ${id}`);
  }

  return (
    <div className="Page5 w-full h-full">
      <Heading
        className="RewindHeading Heading1 w-full"
        align="center"
        size="7"
      >
        You've played a lot of decks this year.
      </Heading>
      <Heading
        className="RewindHeading Heading2 w-full"
        align="center"
        size="7"
      >
        {deckMap.size} unique {getAmountIntlString(deckMap.size, "one", "ones")}{" "}
        to be precise.
      </Heading>
      <Heading
        className="RewindHeading Heading3 w-full"
        align="center"
        size="7"
      >
        But one of them stood above the rest.
      </Heading>
      <Heading
        className="RewindHeading Heading4 w-full"
        align="center"
        size="7"
      >
        One deck that you loved just a bit more than all the others...
      </Heading>
      <div className="RewindHeading Heading5 w-full">
        <Heading align="center" size="8">
          {mostPlayedDeck.name}
        </Heading>
        <Heading align="center" size="7">
          {mostPlayedDeck.commander}
        </Heading>
      </div>
      <Heading
        id="AnimationEndTrigger"
        className="RewindHeading Heading6 w-full"
        align="center"
        size="5"
      >
        which you've played {mostPlayedDeckPlayCount}{" "}
        {getAmountIntlString(
          mostPlayedDeckPlayCount,
          "time",
          "different times"
        )}{" "}
        and won {winsWithDeck}{" "}
        {getAmountIntlString(winsWithDeck, "time", "times")} with.
      </Heading>
    </div>
  );
}
