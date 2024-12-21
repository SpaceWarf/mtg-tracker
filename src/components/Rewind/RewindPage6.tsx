import "@assets/styles/Rewind.scss";
import { Heading } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";
import { getAllGamesForPlayerAndDeck } from "../../utils/Game";
import { getPlayerDecksPlayedMap } from "../../utils/Player";

type OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

export function RewindPage6({ viewer, games, decks }: OwnProps) {
  const deckMap = getPlayerDecksPlayedMap(viewer, games);
  const deck1 = getXMostPlayedDeck(0);
  const gamesPlayedWithDeck1 = getAllGamesForPlayerAndDeck(
    viewer,
    deck1,
    games
  );
  const winsWithDeck1 = gamesPlayedWithDeck1.filter(
    (games) => games.won
  ).length;

  const deck2 = getXMostPlayedDeck(1);
  const gamesPlayedWithDeck2 = getAllGamesForPlayerAndDeck(
    viewer,
    deck2,
    games
  );
  const winsWithDeck2 = gamesPlayedWithDeck2.filter(
    (games) => games.won
  ).length;

  const deck3 = getXMostPlayedDeck(2);
  const gamesPlayedWithDeck3 = getAllGamesForPlayerAndDeck(
    viewer,
    deck3,
    games
  );
  const winsWithDeck3 = gamesPlayedWithDeck3.filter(
    (games) => games.won
  ).length;

  const deck4 = getXMostPlayedDeck(3);
  const gamesPlayedWithDeck4 = getAllGamesForPlayerAndDeck(
    viewer,
    deck4,
    games
  );
  const winsWithDeck4 = gamesPlayedWithDeck4.filter(
    (games) => games.won
  ).length;

  const deck5 = getXMostPlayedDeck(4);
  const gamesPlayedWithDeck5 = getAllGamesForPlayerAndDeck(
    viewer,
    deck5,
    games
  );
  const winsWithDeck5 = gamesPlayedWithDeck5.filter(
    (games) => games.won
  ).length;

  function getXMostPlayedDeckId(x: number): string {
    const entry = [...deckMap.entries()].sort((a, b) => b[1] - a[1])[x];
    return entry ? entry[0] : "";
  }

  function getXMostPlayedDeck(x: number): DbDeck {
    const id = getXMostPlayedDeckId(x);
    const deck = decks.find((deck) => deck.id === id);

    if (deck) {
      return deck;
    }

    return {} as DbDeck;
  }

  return (
    <div className="Page6 w-full h-full">
      <Heading
        className="RewindHeading Heading1 w-full"
        align="center"
        size="7"
      >
        What other decks have you loved this year?
      </Heading>
      <div className="RewindHeading Heading2 w-full">
        <Heading size="6">{deck1.name}</Heading>
        <Heading size="4">{deck1.commander}</Heading>
        <Heading size="3">
          {gamesPlayedWithDeck1.length} games played, {winsWithDeck1} wins
        </Heading>
      </div>
      <div className="RewindHeading Heading3 w-full">
        <Heading size="6">{deck2.name}</Heading>
        <Heading size="4">{deck2.commander}</Heading>
        <Heading size="3">
          {gamesPlayedWithDeck2.length} games played, {winsWithDeck2} wins
        </Heading>
      </div>
      <div className="RewindHeading Heading4 w-full">
        <Heading size="6">{deck3.name}</Heading>
        <Heading size="4">{deck3.commander}</Heading>
        <Heading size="3">
          {gamesPlayedWithDeck3.length} games played, {winsWithDeck3} wins
        </Heading>
      </div>
      <div className="RewindHeading Heading5 w-full">
        <Heading size="6">{deck4.name}</Heading>
        <Heading size="4">{deck4.commander}</Heading>
        <Heading size="3">
          {gamesPlayedWithDeck4.length} games played, {winsWithDeck4} wins
        </Heading>
      </div>
      <div id="AnimationEndTrigger" className="RewindHeading Heading6 w-full">
        {deck5.name && (
          <>
            <Heading size="6">{deck5.name}</Heading>
            <Heading size="4">{deck5.commander}</Heading>
            <Heading size="3">
              {gamesPlayedWithDeck5.length} games played, {winsWithDeck5} wins
            </Heading>
          </>
        )}
      </div>
    </div>
  );
}
