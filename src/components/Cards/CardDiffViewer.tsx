import { Flex, Grid } from "@radix-ui/themes";
import { useMemo } from "react";
import "../../assets/styles/CardListCategory.scss";
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
  direction?: "column" | "row";
};

export function CardDiffViewer({
  added,
  removed,
  mousePosition,
  gameChangers,
  withDescription,
  direction = "column",
}: OwnProps) {
  const diffCount = useMemo(() => {
    let count = 0;

    if (added.length > 0) {
      count++;
    }

    if (removed.length > 0) {
      count++;
    }

    return count;
  }, [added.length, removed.length]);

  const columns = useMemo(() => {
    return direction === "row" ? `${diffCount}` : "1";
  }, [direction, diffCount]);

  return (
    <Flex
      className="card-list-category"
      direction="column"
      gap="1"
      flexGrow="1"
    >
      {withDescription && (
        <p className="category-header">Differences with latest version</p>
      )}
      <Grid
        columns={columns}
        width={direction === "row" ? `${diffCount * 350}px` : undefined}
        gap="5"
      >
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
      </Grid>
    </Flex>
  );
}
