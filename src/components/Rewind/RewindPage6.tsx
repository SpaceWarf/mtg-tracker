import "@assets/styles/Rewind.scss";
import { Heading } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";
import { DeckPlayStats } from "../../state/PlayerDeckStats";
import { getAllGamesForPlayerAndDeck } from "../../utils/Game";
import { getAmountIntlString } from "../../utils/Intl";
import { getPlayerDecksPlayedMap } from "../../utils/Player";

type OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

export function RewindPage6({ viewer, games, decks }: OwnProps) {
  const deckMap = getPlayerDecksPlayedMap(viewer, games);
  const deck1Stats = getStatsForDeckAtIndex(0);
  const deck2Stats = getStatsForDeckAtIndex(1);
  const deck3Stats = getStatsForDeckAtIndex(2);
  const deck4Stats = getStatsForDeckAtIndex(3);
  const deck5Stats = getStatsForDeckAtIndex(4);

  function getMostPlayedDeckIdAtIndex(idx: number): string {
    const entry = [...deckMap.entries()].sort((a, b) => b[1] - a[1])[idx];
    return entry ? entry[0] : "";
  }

  function getMostPlayedDeckAtIndex(idx: number): DbDeck {
    const id = getMostPlayedDeckIdAtIndex(idx);
    const deck = decks.find((deck) => deck.id === id);

    if (deck) {
      return deck;
    }

    return {} as DbDeck;
  }

  function getStatsForDeckAtIndex(idx: number): DeckPlayStats {
    const deck = getMostPlayedDeckAtIndex(idx);
    const gamesPlayed = getAllGamesForPlayerAndDeck(viewer, deck, games);
    const gamesWon = gamesPlayed.filter((games) => games.won).length;

    return {
      deck,
      gamesPlayed: gamesPlayed.length,
      gamesWon,
    };
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
        <Heading size="6">{deck1Stats.deck.name}</Heading>
        <Heading size="4">{deck1Stats.deck.commander}</Heading>
        <Heading size="3">
          {deck1Stats.gamesPlayed}{" "}
          {getAmountIntlString(deck1Stats.gamesPlayed, "game", "games")} played,{" "}
          {deck1Stats.gamesWon}{" "}
          {getAmountIntlString(deck1Stats.gamesWon, "win", "wins")}
        </Heading>
      </div>
      <div className="RewindHeading Heading3 w-full">
        <Heading size="6">{deck2Stats.deck.name}</Heading>
        <Heading size="4">{deck2Stats.deck.commander}</Heading>
        <Heading size="3">
          {deck2Stats.gamesPlayed}{" "}
          {getAmountIntlString(deck2Stats.gamesPlayed, "game", "games")} played,{" "}
          {deck2Stats.gamesWon}{" "}
          {getAmountIntlString(deck2Stats.gamesWon, "win", "wins")}
        </Heading>
      </div>
      <div className="RewindHeading Heading4 w-full">
        <Heading size="6">{deck3Stats.deck.name}</Heading>
        <Heading size="4">{deck3Stats.deck.commander}</Heading>
        <Heading size="3">
          {deck3Stats.gamesPlayed}{" "}
          {getAmountIntlString(deck3Stats.gamesPlayed, "game", "games")} played,{" "}
          {deck3Stats.gamesWon}{" "}
          {getAmountIntlString(deck3Stats.gamesWon, "win", "wins")}
        </Heading>
      </div>
      <div className="RewindHeading Heading5 w-full">
        <Heading size="6">{deck4Stats.deck.name}</Heading>
        <Heading size="4">{deck4Stats.deck.commander}</Heading>
        <Heading size="3">
          {deck4Stats.gamesPlayed}{" "}
          {getAmountIntlString(deck4Stats.gamesPlayed, "game", "games")} played,{" "}
          {deck4Stats.gamesWon}{" "}
          {getAmountIntlString(deck4Stats.gamesWon, "win", "wins")}
        </Heading>
      </div>
      <div id="AnimationEndTrigger" className="RewindHeading Heading6 w-full">
        {deck5Stats.deck.name && (
          <>
            <Heading size="6">{deck5Stats.deck.name}</Heading>
            <Heading size="4">{deck5Stats.deck.commander}</Heading>
            <Heading size="3">
              {deck5Stats.gamesPlayed}{" "}
              {getAmountIntlString(deck5Stats.gamesPlayed, "game", "games")}{" "}
              played, {deck5Stats.gamesWon}{" "}
              {getAmountIntlString(deck5Stats.gamesWon, "win", "wins")}
            </Heading>
          </>
        )}
      </div>
    </div>
  );
}
