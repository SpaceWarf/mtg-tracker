export interface ArchidektRedux {
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
}
