import { DeckCardDetails } from "./DeckDetails";

export interface CardDiff {
  added: DeckCardDetails[];
  removed: DeckCardDetails[];
}
