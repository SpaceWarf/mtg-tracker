import { DatabaseItem } from "./DatabaseItem";

export interface Deck {
  name: string;
  commander: string;
  url?: string;
  builder?: string;
}

export interface DbDeck extends Deck, DatabaseItem {}

export interface DeckWithStats extends DbDeck {
  gamesPlayed: number;
  winCount: number;
  winRate: number;
}
