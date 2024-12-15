import { DbDeck } from "../state/Deck";
import { DbGame, GamePlayer } from "../state/Game";

export function getAllGamesForDeck(
  deck: DbDeck,
  games: DbGame[]
): GamePlayer[] {
  return games.reduce((games: GamePlayer[], nextGame: DbGame) => {
    if (nextGame.player1.deck === deck.id) {
      return [...games, nextGame.player1];
    }

    if (nextGame.player2.deck === deck.id) {
      return [...games, nextGame.player2];
    }

    if (nextGame.player3.deck === deck.id) {
      return [...games, nextGame.player3];
    }

    if (nextGame.player4.deck === deck.id) {
      return [...games, nextGame.player4];
    }

    return games;
  }, []);
}

export function getDeckGamesCount(deck: DbDeck, games: DbGame[]): number {
  return getAllGamesForDeck(deck, games).length;
}

export function getDeckWinCount(deck: DbDeck, games: DbGame[]): number {
  return getAllGamesForDeck(deck, games).filter((game) => game.won).length;
}

export function getDeckWinRate(deck: DbDeck, games: DbGame[]): number {
  const gamesCount = getDeckGamesCount(deck, games);
  const winCount = getDeckWinCount(deck, games);
  return winCount / gamesCount || 0;
}
