import { PlayerSortFctKey } from "./PlayerSortFctKey";

type SortFctKey = PlayerSortFctKey;

export type SortFct<T> = {
  [key in SortFctKey]: {
    name: string;
    sortFct: (a: T, b: T) => number;
    highlightedKey: string;
    highlightedDirection: "asc" | "desc";
  };
};
