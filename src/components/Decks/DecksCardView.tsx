import { Flex } from "@radix-ui/themes";
import { useAuth } from "../../hooks/useAuth";
import { DeckWithStats } from "../../state/Deck";
import { DeckCard2 } from "./DeckCard2";

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
  const auth = useAuth();

  return (
    <Flex className="mb-10" flexGrow="1" gap="25px" wrap="wrap">
      {decks.map((deck) => (
        <div key={deck.id} style={{ flexBasis: "calc(33.33% - 25px)" }}>
          <DeckCard2
            deck={deck}
            editable={!!auth.user}
            highlightedKey={highlightedKey}
            highlightedDirection={highlightedDirection}
          />
        </div>
      ))}
    </Flex>
  );
}
