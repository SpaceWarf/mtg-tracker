import { DatabaseItem } from "./DatabaseItem";
import { DbDeck } from "./Deck";
import { DbPlayer } from "./Player";

export interface Game {
  date: string;
  player1: GamePlayer;
  player2: GamePlayer;
  player3: GamePlayer;
  player4: GamePlayer;
  comments: string;
}

export interface GamePlayer {
  player: string;
  playerObj?: DbPlayer;
  deck: string;
  deckVersion?: string;
  deckObj?: DbDeck;
  started: boolean;
  t1SolRing: boolean;
  won: boolean;
}

export interface DbGame extends Game, DatabaseItem {}
