import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import { getAllGamesForDeck } from "./Game";

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
