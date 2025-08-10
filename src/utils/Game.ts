import { DbDeck } from "../state/Deck";
import { DbGame, GamePlayer } from "../state/Game";
import { DbPlayer } from "../state/Player";

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

export function getAllGamesForPlayerAndDeck(
  player: DbPlayer,
  deck: DbDeck,
  games: DbGame[]
): GamePlayer[] {
  return games.reduce((games: GamePlayer[], nextGame: DbGame) => {
    if (
      nextGame.player1.player === player.id &&
      nextGame.player1.deck === deck.id
    ) {
      return [...games, nextGame.player1];
    }

    if (
      nextGame.player2.player === player.id &&
      nextGame.player2.deck === deck.id
    ) {
      return [...games, nextGame.player2];
    }

    if (
      nextGame.player3.player === player.id &&
      nextGame.player3.deck === deck.id
    ) {
      return [...games, nextGame.player3];
    }

    if (
      nextGame.player4.player === player.id &&
      nextGame.player4.deck === deck.id
    ) {
      return [...games, nextGame.player4];
    }

    return games;
  }, []);
}

export function gameHasAllPlayers(game: DbGame, playerIds: string[]): boolean {
  return playerIds.length
    ? playerIds.every((playerId) =>
        [
          game.player1.player,
          game.player2.player,
          game.player3.player,
          game.player4.player,
        ].includes(playerId)
      )
    : true;
}

export function gameHasSomePlayers(game: DbGame, playerIds: string[]): boolean {
  return playerIds.length
    ? playerIds.some((playerId) =>
        [
          game.player1.player,
          game.player2.player,
          game.player3.player,
          game.player4.player,
        ].includes(playerId)
      )
    : false;
}

export function gameHasAllDecks(game: DbGame, deckIds: string[]): boolean {
  return deckIds.length
    ? deckIds.every((deckId) =>
        [
          game.player1.deck,
          game.player2.deck,
          game.player3.deck,
          game.player4.deck,
        ].includes(deckId)
      )
    : true;
}

export function gameHasSomeDecks(game: DbGame, deckIds: string[]): boolean {
  return deckIds.length
    ? deckIds.some((deckId) =>
        [
          game.player1.deck,
          game.player2.deck,
          game.player3.deck,
          game.player4.deck,
        ].includes(deckId)
      )
    : false;
}
