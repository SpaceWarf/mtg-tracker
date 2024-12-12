import { DatabaseItem } from "./DatabaseItem";

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
  deck: string;
  started: boolean;
  t1SolRing: boolean;
  won: boolean;
}

export interface DbGame extends Game, DatabaseItem {}
