export interface ArchidektReduxData {
  deck: ArchidektReduxDeck;
}

export interface ArchidektReduxDeck {
  id: number;
  name: string;
  owner: string;
  ownerId: number;
  format: number;
  categories: ArchidektReduxCategoryMap;
  cardMap: ArchidektReduxCardMap;
  featured: string;
  viewCount: number;
  updatedAt: string;
  createdAt: string;
}

export type ArchidektReduxCategoryMap = {
  [key: string]: ArchidektReduxCategory;
};

export interface ArchidektReduxCategory {
  id: number;
  name: string;
  isPremier: boolean;
  includedInDeck: boolean;
  includedInPrice: boolean;
}

export type ArchidektReduxCardMap = {
  [key: string]: ArchidektReduxCard;
};

export interface ArchidektReduxCard {
  // TODO: complete interface
  name: string;
  categories: string[];
  colorIdentity: string[];
  cmc: number;
  castingCost: (string | string[])[];
  text: string;
  types: string[];
  gameChanger: boolean;
  qty: number;
  layout: ArchidektReduxCardLayout;
  front: ArchidektReduxCardSide;
  back: ArchidektReduxCardSide;
  collectorNumber: string;
  setCode: string;
}

export enum ArchidektReduxCardLayout {
  NORMAL = "normal",
  MODAL_DFC = "modal_dfc",
  SPLIT = "split",
}

export interface ArchidektReduxCardSide {
  colors: string[];
  flavor: string;
  manaCost: string;
  name: string;
  power: string;
  subTypes: string[];
  superTypes: string[];
  text: string;
  toughness: string;
  types: string[];
  loyalty?: number;
  castingCost: (string | string[])[];
}
