import { Grid } from "@radix-ui/themes";
import { useAuth } from "../../hooks/useAuth";
import { DeckWithStats } from "../../state/Deck";
import { DeckCard } from "./DeckCard";

type OwnProps = {
  decks: DeckWithStats[];
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function DecksCardView({ decks }: OwnProps) {
  const auth = useAuth();

  return (
    <Grid columns={{ initial: "1", sm: "2", xl: "3" }} gap="5">
      {decks.map((deck) => (
        <div key={deck.id}>
          <DeckCard deck={deck} editable={!!auth.user} showActions />
        </div>
      ))}
    </Grid>
  );
}
