import { DatabaseItem } from "./DatabaseItem";
import { DeckCardDetails, DeckCategoryDetails } from "./DeckDetails";
import { DeckVersion } from "./DeckVersion";

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
  versions?: DeckVersion[];
  latestVersionId: string;
}

export interface DbDeck extends Deck, DatabaseItem {}

export interface DeckWithStats extends DbDeck {
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  gameChangers: string[];
  massLandDenials: string[];
  extraTurns: string[];
  tutors: string[];
}
