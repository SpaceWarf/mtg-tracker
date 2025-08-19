import { DeckCardDetails, DeckCategoryDetails } from "./DeckDetails";
import { DiffType } from "./DiffType";

export interface CategoryCardList {
  category: DeckCategoryDetails;
  cards: DeckCardDetails[];
  description?: string;
  diffType?: DiffType;
}
