import { DbGame, GamePlayer } from "../state/Game";
import { DbPlayer } from "../state/Player";

export function getAllGamesWithPlayer(
  player: DbPlayer,
  games: DbGame[]
): DbGame[] {
  return games.reduce((games: DbGame[], nextGame: DbGame) => {
    if (
      [
        nextGame.player1.player,
        nextGame.player2.player,
        nextGame.player3.player,
        nextGame.player4.player,
      ].includes(player.id)
    ) {
      return [...games, nextGame];
    }

    return games;
  }, []);
}

export function getAllGamesForPlayer(
  player: DbPlayer,
  games: DbGame[]
): GamePlayer[] {
  return games.reduce((games: GamePlayer[], nextGame: DbGame) => {
    if (nextGame.player1.player === player.id) {
      return [...games, nextGame.player1];
    }

    if (nextGame.player2.player === player.id) {
      return [...games, nextGame.player2];
    }

    if (nextGame.player3.player === player.id) {
      return [...games, nextGame.player3];
    }

    if (nextGame.player4.player === player.id) {
      return [...games, nextGame.player4];
    }

    return games;
  }, []);
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
