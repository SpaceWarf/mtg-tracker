import { CardDiff } from "./CardDiff";

export interface DeckVersion {
  id: string;
  createdAt: string;
  cardDiff: CardDiff;
}
