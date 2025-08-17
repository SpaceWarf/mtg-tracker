import { DeckWithStats } from "./Deck";
import { DeckSortFctKey } from "./DeckSortFctKey";
import { SortFct } from "./SortFct";

export const DECK_SORT_FCTS: SortFct<DeckWithStats> = {
  [DeckSortFctKey.NAME_ASC]: {
    name: "Name - ASC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      a.name.localeCompare(b.name),
    highlightedKey: "name",
    highlightedDirection: "asc",
  },
  [DeckSortFctKey.NAME_DESC]: {
    name: "Name - DESC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      b.name.localeCompare(a.name),
    highlightedKey: "name",
    highlightedDirection: "desc",
  },
  [DeckSortFctKey.COMMANDER_ASC]: {
    name: "Commander - ASC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      a.commander?.localeCompare(b.commander ?? "") ?? 0,
    highlightedKey: "commander",
    highlightedDirection: "asc",
  },
  [DeckSortFctKey.COMMANDER_DESC]: {
    name: "Commander - DESC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      b.commander?.localeCompare(a.commander ?? "") ?? 0,
    highlightedKey: "commander",
    highlightedDirection: "desc",
  },
  [DeckSortFctKey.GAMES_PLAYED_ASC]: {
    name: "Games played - ASC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      a.gamesPlayed - b.gamesPlayed,
    highlightedKey: "gamesPlayed",
    highlightedDirection: "asc",
  },
  [DeckSortFctKey.GAMES_PLAYED_DESC]: {
    name: "Games played - DESC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      b.gamesPlayed - a.gamesPlayed,
    highlightedKey: "gamesPlayed",
    highlightedDirection: "desc",
  },
  [DeckSortFctKey.WIN_COUNT_ASC]: {
    name: "Win count - ASC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) => a.winCount - b.winCount,
    highlightedKey: "winCount",
    highlightedDirection: "asc",
  },
  [DeckSortFctKey.WIN_COUNT_DESC]: {
    name: "Win count - DESC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) => b.winCount - a.winCount,
    highlightedKey: "winCount",
    highlightedDirection: "desc",
  },
  [DeckSortFctKey.WIN_RATE_ASC]: {
    name: "Win rate - ASC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) => a.winRate - b.winRate,
    highlightedKey: "winRate",
    highlightedDirection: "asc",
  },
  [DeckSortFctKey.WIN_RATE_DESC]: {
    name: "Win rate - DESC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) => b.winRate - a.winRate,
    highlightedKey: "winRate",
    highlightedDirection: "desc",
  },
  [DeckSortFctKey.BUILDER_ASC]: {
    name: "Built By - ASC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      (a.builder ?? "-").localeCompare(b.builder ?? "-"),
    highlightedKey: "builder",
    highlightedDirection: "asc",
  },
  [DeckSortFctKey.BUILDER_DESC]: {
    name: "Built By - DESC",
    sortFct: (a: DeckWithStats, b: DeckWithStats) =>
      (b.builder ?? "-").localeCompare(a.builder ?? "-"),
    highlightedKey: "builder",
    highlightedDirection: "desc",
  },
};

export function getDeckSortFctName(key: DeckSortFctKey): string {
  return DECK_SORT_FCTS[key].name;
}
