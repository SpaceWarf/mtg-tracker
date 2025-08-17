import { DeckCardDetails, DeckCategoryDetails } from "./DeckDetails";

export interface CategoryCardList {
  category: DeckCategoryDetails;
  cards: DeckCardDetails[];
}
