import { DeckCardDetails } from "./DeckDetails";

export interface CardDiff {
  added: CardDiffItem[];
  removed: CardDiffItem[];
}

export interface CardDiffItem {
  card: DeckCardDetails;
  qty: number;
}
