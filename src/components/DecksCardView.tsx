import { Flex } from "@radix-ui/themes";
import { DeckWithStats } from "../state/Deck";
import { DeckCard } from "./DeckCard";

type OwnProps = {
  decks: DeckWithStats[];
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function DecksCardView({
  decks,
  highlightedKey,
  highlightedDirection,
}: OwnProps) {
  return (
    <Flex className="mb-10" flexGrow="1" gap="25px" wrap="wrap">
      {decks.map((deck) => (
        <div key={deck.id} style={{ flexBasis: "calc(25% - 18.75px)" }}>
          <DeckCard
            key={deck.id}
            deck={deck}
            highlightedKey={highlightedKey}
            highlightedDirection={highlightedDirection}
            gamesPlayed={deck.gamesPlayed}
            winCount={deck.winCount}
            winRate={deck.winRate}
          />
        </div>
      ))}
    </Flex>
  );
}
