import { PlayerWithStats } from "./Player";
import { PlayerSortFctKey } from "./PlayerSortFctKey";
import { SortFct } from "./SortFct";

export const PLAYER_SORT_FCTS: SortFct<PlayerWithStats> = {
  [PlayerSortFctKey.NAME_ASC]: {
    name: "Name - ASC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
      a.name.localeCompare(b.name),
    highlightedKey: "name",
    highlightedDirection: "asc",
  },
  [PlayerSortFctKey.NAME_DESC]: {
    name: "Name - DESC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
      b.name.localeCompare(a.name),
    highlightedKey: "name",
    highlightedDirection: "desc",
  },
  [PlayerSortFctKey.GAMES_PLAYED_ASC]: {
    name: "Games played - ASC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
      a.gamesPlayed - b.gamesPlayed,
    highlightedKey: "gamesPlayed",
    highlightedDirection: "asc",
  },
  [PlayerSortFctKey.GAMES_PLAYED_DESC]: {
    name: "Games played - DESC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
      b.gamesPlayed - a.gamesPlayed,
    highlightedKey: "gamesPlayed",
    highlightedDirection: "desc",
  },
  [PlayerSortFctKey.WIN_COUNT_ASC]: {
    name: "Win count - ASC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
      a.winCount - b.winCount,
    highlightedKey: "winCount",
    highlightedDirection: "asc",
  },
  [PlayerSortFctKey.WIN_COUNT_DESC]: {
    name: "Win count - DESC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
      b.winCount - a.winCount,
    highlightedKey: "winCount",
    highlightedDirection: "desc",
  },
  [PlayerSortFctKey.WIN_RATE_ASC]: {
    name: "Win rate - ASC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) => a.winRate - b.winRate,
    highlightedKey: "winRate",
    highlightedDirection: "asc",
  },
  [PlayerSortFctKey.WIN_RATE_DESC]: {
    name: "Win rate - DESC",
    sortFct: (a: PlayerWithStats, b: PlayerWithStats) => b.winRate - a.winRate,
    highlightedKey: "winRate",
    highlightedDirection: "desc",
  },
  // [PlayerSortFctKey.START_COUNT_ASC]: {
  //   name: "Start count - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     a.startCount - b.startCount,
  //   highlightedKey: "startCount",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.START_COUNT_DESC]: {
  //   name: "Start count - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     b.startCount - a.startCount,
  //   highlightedKey: "startCount",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.START_RATE_ASC]: {
  //   name: "Start rate - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     a.startRate - b.startRate,
  //   highlightedKey: "startRate",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.START_RATE_DESC]: {
  //   name: "Start rate - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     b.startRate - a.startRate,
  //   highlightedKey: "startRate",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.START_TO_WIN_RATE_ASC]: {
  //   name: "Start to win rate - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     a.startToWinRate - b.startToWinRate,
  //   highlightedKey: "startToWinRate",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.START_TO_WIN_RATE_DESC]: {
  //   name: "Start to win rate - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     b.startToWinRate - a.startToWinRate,
  //   highlightedKey: "startToWinRate",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.SOL_RING_COUNT_ASC]: {
  //   name: "Sol Ring count - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     a.solRingCount - b.solRingCount,
  //   highlightedKey: "solRingCount",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.SOL_RING_COUNT_DESC]: {
  //   name: "Sol Ring count - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     b.solRingCount - a.solRingCount,
  //   highlightedKey: "solRingCount",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.SOL_RING_RATE_ASC]: {
  //   name: "Sol Ring rate - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     a.solRingRate - b.solRingRate,
  //   highlightedKey: "solRingRate",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.SOL_RING_RATE_DESC]: {
  //   name: "Sol Ring rate - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     b.solRingRate - a.solRingRate,
  //   highlightedKey: "solRingRate",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.SOL_RING_TO_WIN_RATE_ASC]: {
  //   name: "Sol Ring to win rate - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     a.solRingToWinRate - b.solRingToWinRate,
  //   highlightedKey: "solRingToWinRate",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.SOL_RING_TO_WIN_RATE_DESC]: {
  //   name: "Sol Ring to win rate - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     b.solRingToWinRate - a.solRingToWinRate,
  //   highlightedKey: "solRingToWinRate",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.GRAND_SLAM_COUNT_ASC]: {
  //   name: "Grand Slam count - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     a.grandSlamCount - b.grandSlamCount,
  //   highlightedKey: "grandSlamCount",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.GRAND_SLAM_COUNT_DESC]: {
  //   name: "Grand Slam count - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     b.grandSlamCount - a.grandSlamCount,
  //   highlightedKey: "grandSlamCount",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.UNIQUE_DECKS_PLAYED_ASC]: {
  //   name: "Unique decks played - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     [...a.deckPlayedMap.values()].filter((value) => value > 0).length -
  //     [...b.deckPlayedMap.values()].filter((value) => value > 0).length,
  //   highlightedKey: "uniqueDecksPlayed",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.UNIQUE_DECKS_PLAYED_DESC]: {
  //   name: "Unique decks played - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     [...b.deckPlayedMap.values()].filter((value) => value > 0).length -
  //     [...a.deckPlayedMap.values()].filter((value) => value > 0).length,
  //   highlightedKey: "uniqueDecksPlayed",
  //   highlightedDirection: "desc",
  // },
  // [PlayerSortFctKey.UNIQUE_DECKS_WON_ASC]: {
  //   name: "Unique decks won with - ASC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     [...a.deckWonMap.values()].filter((value) => value > 0).length -
  //     [...b.deckWonMap.values()].filter((value) => value > 0).length,
  //   highlightedKey: "uniqueDecksWon",
  //   highlightedDirection: "asc",
  // },
  // [PlayerSortFctKey.UNIQUE_DECKS_WON_DESC]: {
  //   name: "Unique decks won with - DESC",
  //   sortFct: (a: PlayerWithStats, b: PlayerWithStats) =>
  //     [...b.deckWonMap.values()].filter((value) => value > 0).length -
  //     [...a.deckWonMap.values()].filter((value) => value > 0).length,
  //   highlightedKey: "uniqueDecksWon",
  //   highlightedDirection: "desc",
  // },
};

export function getPlayerSortFctName(key: PlayerSortFctKey): string {
  return PLAYER_SORT_FCTS[key].name;
}
