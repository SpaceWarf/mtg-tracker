export type SortFct<T> = {
  [key: string]: {
    name: string;
    sortFct: (a: T, b: T) => number;
    highlightedKey: string;
    highlightedDirection: "asc" | "desc";
  };
};
