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
  massLandDenial: boolean;
  manaProduction: ArchidektReduxCardManaProduction;
  extraTurns: boolean;
  tutor: boolean;
}

export enum ArchidektReduxCardLayout {
  NORMAL = "normal",
  SPLIT = "split",
  FLIP = "flip",
  TRANSFORM = "transform",
  MODAL_DFC = "modal_dfc",
  MELD = "meld",
  LEVELER = "leveler",
  CLASS = "class",
  CASE = "case",
  SAGA = "saga",
  ADVENTURE = "adventure",
  MUTATE = "mutate",
  PROTOTYPE = "prototype",
  BATTLE = "battle",
  PLANAR = "planar",
  SCHEME = "scheme",
  VANGUARD = "vanguard",
  TOKEN = "token",
  DOUBLE_FACED_TOKEN = "double_faced_token",
  EMBLEM = "emblem",
  AUGMENT = "augment",
  HOST = "host",
  ART_SERIES = "art_series",
  REVERSIBLE_CARD = "reversible_card",
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

export interface ArchidektReduxCardManaProduction {
  B: number | null;
  C: number | null;
  G: number | null;
  R: number | null;
  U: number | null;
  W: number | null;
}
