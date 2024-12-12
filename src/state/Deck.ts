import { DatabaseItem } from "./DatabaseItem";

export interface Deck {
  name: string;
  commander: string;
}

export interface DbDeck extends Deck, DatabaseItem {}
