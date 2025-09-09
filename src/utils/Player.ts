import { cloneDeep, omit } from "lodash";
import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import { DbPlayer, DeckStats, PlayerWithStats } from "../state/Player";
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

export function getPlayerDeckStatsMap(
  player: DbPlayer,
  games: DbGame[]
): Map<string, DeckStats> {
  const map = new Map<string, DeckStats>();
  const gamesPlayed = getAllGamesForPlayer(player, games);
  gamesPlayed.forEach((game) => {
    const entry = map.get(game.deck);
    if (entry) {
      const played = entry.played + 1;
      const won = entry.won + (game.won ? 1 : 0);
      const lost = entry.lost + (game.won ? 0 : 1);
      const winRate = played > 0 ? won / played : 0;
      map.set(game.deck, {
        ...entry,
        played,
        won,
        lost,
        winRate,
      });
    } else {
      map.set(game.deck, {
        played: 1,
        won: game.won ? 1 : 0,
        lost: game.won ? 0 : 1,
        winRate: game.won ? 1 : 0,
      });
    }
  });
  console.log(map);
  return map;
}

export function getPlayerByExternalId(
  externalId: string,
  players: DbPlayer[]
): DbPlayer | undefined {
  return players.find((player) => player.externalId === externalId);
}

export function populatePlayer(
  player: DbPlayer,
  games: DbGame[],
  decks: DbDeck[]
): PlayerWithStats {
  return {
    ...cloneDeep(player),
    gamesPlayed: getPlayerGamesCount(player, games),
    winCount: getPlayerWinCount(player, games),
    winRate: getPlayerWinRate(player, games),
    startCount: getPlayerGamesStarted(player, games),
    startRate: getPlayerGamesStartedRate(player, games),
    startToWinRate: getPlayerGamesStartedToWinRate(player, games),
    solRingCount: getPlayerSolRingCount(player, games),
    solRingRate: getPlayerSolRingRate(player, games),
    solRingToWinRate: getPlayerSolRingToWinRate(player, games),
    grandSlamCount: getPlayerGrandSlamCount(player, games),
    deckPlayedMap: getPlayerDecksPlayedMap(player, games),
    deckWonMap: getPlayerDecksWonMap(player, games),
    decksBuilt: decks.filter((deck) => deck.builder === player.id).length,
    deckStatsMap: getPlayerDeckStatsMap(player, games),
  };
}
