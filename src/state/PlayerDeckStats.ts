import { DbDeck } from "./Deck";

export interface DeckPlayStats {
  deck: DbDeck;
  gamesPlayed: number;
  gamesWon: number;
}
