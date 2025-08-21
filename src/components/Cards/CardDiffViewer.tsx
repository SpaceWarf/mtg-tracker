import { Flex, Heading } from "@radix-ui/themes";
import { DeckCardDetails } from "../../state/DeckDetails";
import { DiffType } from "../../state/DiffType";
import { MousePosition } from "../../state/MousePosition";
import { CardListCategory } from "./CardListCategory";

type OwnProps = {
  added: DeckCardDetails[];
  removed: DeckCardDetails[];
  mousePosition: MousePosition;
  gameChangers: DeckCardDetails[];
  withDescription?: boolean;
};

export function CardDiffViewer({
  added,
  removed,
  mousePosition,
  gameChangers,
  withDescription = false,
}: OwnProps) {
  return (
    <Flex direction="column" gap="1" flexGrow="1">
      {withDescription && (
        <Heading size="4">Differences with latest version</Heading>
      )}
      <Flex direction="column" gap="3">
        {added.length > 0 && (
          <CardListCategory
            category={{
              category: {
                name: "Added",
                isPremier: false,
                includedInDeck: true,
                includedInPrice: true,
              },
              cards: added,
              description: withDescription
                ? "Cards present in the latest version"
                : undefined,
              diffType: DiffType.ADDED,
            }}
            mousePosition={mousePosition}
            gameChangers={gameChangers}
          />
        )}
        {removed.length > 0 && (
          <CardListCategory
            category={{
              category: {
                name: "Removed",
                isPremier: false,
                includedInDeck: true,
                includedInPrice: true,
              },
              cards: removed,
              description: withDescription
                ? "Cards absent in the latest version"
                : undefined,
              diffType: DiffType.REMOVED,
            }}
            mousePosition={mousePosition}
            gameChangers={gameChangers}
          />
        )}
      </Flex>
    </Flex>
  );
}
