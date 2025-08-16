import { CardSortFctKey } from "./CardSortFctKey";
import { DeckCardDetails } from "./DeckDetails";
import { SortFct } from "./SortFct";

export const CARD_SORT_FCTS: SortFct<DeckCardDetails> = {
  [CardSortFctKey.NAME_ASC]: {
    name: "Name - ASC",
    sortFct: (a: DeckCardDetails, b: DeckCardDetails) =>
      a.name.localeCompare(b.name),
    highlightedKey: "name",
    highlightedDirection: "asc",
  },
  [CardSortFctKey.NAME_DESC]: {
    name: "Name - DESC",
    sortFct: (a: DeckCardDetails, b: DeckCardDetails) =>
      b.name.localeCompare(a.name),
    highlightedKey: "name",
    highlightedDirection: "desc",
  },
  [CardSortFctKey.CMC_ASC]: {
    name: "CMC - ASC",
    sortFct: (a: DeckCardDetails, b: DeckCardDetails) => a.cmc - b.cmc,
    highlightedKey: "cmc",
    highlightedDirection: "asc",
  },
  [CardSortFctKey.CMC_DESC]: {
    name: "CMC - DESC",
    sortFct: (a: DeckCardDetails, b: DeckCardDetails) => b.cmc - a.cmc,
    highlightedKey: "cmc",
    highlightedDirection: "desc",
  },
};

export function getCardSortFctName(key: CardSortFctKey): string {
  return CARD_SORT_FCTS[key].name;
}
