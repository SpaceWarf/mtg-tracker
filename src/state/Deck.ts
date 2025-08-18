import { DatabaseItem } from "./DatabaseItem";
import { DeckCardDetails, DeckCategoryDetails } from "./DeckDetails";

export interface Deck {
  name: string;
  commander?: string;
  externalId?: string;
  builder?: string;
  featured?: string;
  price?: string;
  saltSum?: string;
  size?: string;
  viewCount?: string;
  format?: string;
  deckCreatedAt?: string;
  deckUpdatedAt?: string;
  colourIdentity?: string[];
  cards?: DeckCardDetails[];
  categories?: DeckCategoryDetails[];
  gameChangersDeck?: boolean;
}

export interface DbDeck extends Deck, DatabaseItem {}

export interface DeckWithStats extends DbDeck {
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  gameChangers: string[];
}
