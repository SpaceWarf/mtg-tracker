import { Grid } from "@radix-ui/themes";
import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { DeckWithStats } from "../../state/Deck";
import { DeckCard2 } from "./DeckCard2";

type OwnProps = {
  decks: DeckWithStats[];
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function DecksCardView({ decks }: OwnProps) {
  const auth = useAuth();

  const rowCount = useMemo(() => {
    return Math.ceil(decks.length / 3);
  }, [decks]);

  return (
    <Grid columns="3" rows={`${rowCount}`} gap="5">
      {decks.map((deck) => (
        <div key={deck.id}>
          <DeckCard2 deck={deck} editable={!!auth.user} showActions />
        </div>
      ))}
    </Grid>
  );
}
