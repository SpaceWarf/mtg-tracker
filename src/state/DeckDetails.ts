import { ArchidektReduxCardManaProduction } from "./ArchidektReduxData";

export interface DeckDetails {
  id: string;
  url: string;
  title: string;
  price: string;
  saltSum: string;
  size: string;
  viewCount: string;
  format: string;
  featured: string;
  createdAt: string;
  updatedAt: string;
  commanders: string[];
  owner: string;
  ownerId: string;
  colourIdentity: string[];
  cards: DeckCardDetails[];
  categories: DeckCategoryDetails[];
}

export interface DeckCardDetails {
  name: string;
  category: string;
  colourIdentity: string;
  cmc: number;
  castingCost: string;
  types: string;
  text: string;
  gameChanger: boolean;
  qty: number;
  collectorNumber: string;
  setCode: string;
  layout: string;
  massLandDenial: boolean;
  manaProduction: ArchidektReduxCardManaProduction;
  extraTurns: boolean;
  tutor: boolean;
}

export interface DeckCategoryDetails {
  id?: number;
  name: string;
  isPremier: boolean;
  includedInDeck: boolean;
  includedInPrice: boolean;
}
