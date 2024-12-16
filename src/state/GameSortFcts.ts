import { DbGame } from "./Game";
import { GameSortFctKey } from "./GameSortFctKey";
import { SortFct } from "./SortFct";

export const GAME_SORT_FCTS: SortFct<DbGame> = {
  [GameSortFctKey.DATE_ASC]: {
    name: "Date - ASC",
    sortFct: (a: DbGame, b: DbGame) => a.date.localeCompare(b.date),
    highlightedKey: "date",
    highlightedDirection: "asc",
  },
  [GameSortFctKey.DATE_DESC]: {
    name: "Date - DESC",
    sortFct: (a: DbGame, b: DbGame) => b.date.localeCompare(a.date),
    highlightedKey: "date",
    highlightedDirection: "desc",
  },
};
