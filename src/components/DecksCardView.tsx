import { Flex } from "@radix-ui/themes";
import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import {
  getDeckGamesCount,
  getDeckWinCount,
  getDeckWinRate,
} from "../utils/Deck";
import { DeckCard } from "./DeckCard";

type OwnProps = {
  decks: DbDeck[];
  games: DbGame[];
};

export function DecksCardView({ decks, games }: OwnProps) {
  return (
    <Flex className="mb-10" flexGrow="1" gap="25px" wrap="wrap">
      {decks
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((deck) => (
          <div style={{ flexBasis: "calc(33.33% - 16.66px)" }}>
            <DeckCard
              key={deck.id}
              deck={deck}
              gamesPlayed={getDeckGamesCount(deck, games)}
              winCount={getDeckWinCount(deck, games)}
              winRate={getDeckWinRate(deck, games)}
            />
          </div>
        ))}
    </Flex>
  );
}
