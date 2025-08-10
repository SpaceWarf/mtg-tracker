import { cloneDeep, omit } from "lodash";
import { DbGame } from "../state/Game";
import { DbPlayer, PlayerWithStats } from "../state/Player";
import { getAllGamesForPlayer } from "./Game";

export function getDbPlayerFromPlayerWithStats(
  player: PlayerWithStats
): DbPlayer {
  return cloneDeep(
    omit(
      player,
      "gamesPlayed",
      "winCount",
      "winRate",
      "startCount",
      "startRate",
      "startToWinRate",
      "solRingCount",
      "solRingRate",
      "solRingToWinRate",
      "grandSlamCount",
      "deckPlayedMap",
      "deckWonMap"
    )
  );
}

export function getPlayerGamesCount(player: DbPlayer, games: DbGame[]): number {
  return getAllGamesForPlayer(player, games).length;
}

export function getPlayerWinCount(player: DbPlayer, games: DbGame[]): number {
  return getAllGamesForPlayer(player, games).filter((game) => game.won).length;
}

export function getPlayerWinRate(player: DbPlayer, games: DbGame[]): number {
  const gamesCount = getPlayerGamesCount(player, games);
  const winCount = getPlayerWinCount(player, games);
  return winCount / gamesCount || 0;
}

export function getPlayerGamesStarted(
  player: DbPlayer,
  games: DbGame[]
): number {
  return getAllGamesForPlayer(player, games).filter((game) => game.started)
    .length;
}

export function getPlayerGamesStartedRate(
  player: DbPlayer,
  games: DbGame[]
): number {
  const gamesCount = getPlayerGamesCount(player, games);
  const gamesStarted = getPlayerGamesStarted(player, games);
  return gamesStarted / gamesCount || 0;
}

export function getPlayerGamesStartedAndWon(
  player: DbPlayer,
  games: DbGame[]
): number {
  return getAllGamesForPlayer(player, games).filter(
    (game) => game.started && game.won
  ).length;
}

export function getPlayerGamesStartedToWinRate(
  player: DbPlayer,
  games: DbGame[]
): number {
  const gamesStarted = getPlayerGamesStarted(player, games);
  const gamesStartedAndWon = getPlayerGamesStartedAndWon(player, games);
  return gamesStartedAndWon / gamesStarted || 0;
}

export function getPlayerSolRingCount(
  player: DbPlayer,
  games: DbGame[]
): number {
  return getAllGamesForPlayer(player, games).filter((game) => game.t1SolRing)
    .length;
}

export function getPlayerSolRingRate(
  player: DbPlayer,
  games: DbGame[]
): number {
  const gamesCount = getPlayerGamesCount(player, games);
  const solRingCount = getPlayerSolRingCount(player, games);
  return solRingCount / gamesCount || 0;
}

export function getPlayerSolRingAndWonCount(
  player: DbPlayer,
  games: DbGame[]
): number {
  return getAllGamesForPlayer(player, games).filter(
    (game) => game.t1SolRing && game.won
  ).length;
}

export function getPlayerSolRingToWinRate(
  player: DbPlayer,
  games: DbGame[]
): number {
  const solRingCount = getPlayerSolRingCount(player, games);
  const solRingAndWonCount = getPlayerSolRingAndWonCount(player, games);
  return solRingAndWonCount / solRingCount || 0;
}

export function getPlayerGrandSlamCount(
  player: DbPlayer,
  games: DbGame[]
): number {
  return getAllGamesForPlayer(player, games).filter(
    (game) => game.started && game.t1SolRing && game.won
  ).length;
}

export function getPlayerDecksPlayedMap(
  player: DbPlayer,
  games: DbGame[]
): Map<string, number> {
  const map = new Map<string, number>();
  const gamesPlayed = getAllGamesForPlayer(player, games);
  gamesPlayed.forEach((game) => {
    const entry = map.get(game.deck);
    if (entry) {
      map.set(game.deck, entry + 1);
    } else {
      map.set(game.deck, 1);
    }
  });
  return map;
}

export function getPlayerDecksWonMap(
  player: DbPlayer,
  games: DbGame[]
): Map<string, number> {
  const map = new Map<string, number>();
  const gamesPlayed = getAllGamesForPlayer(player, games);
  gamesPlayed
    .filter((game) => game.won)
    .forEach((game) => {
      const entry = map.get(game.deck);
      if (entry) {
        map.set(game.deck, entry + 1);
      } else {
        map.set(game.deck, 1);
      }
    });
  return map;
}
