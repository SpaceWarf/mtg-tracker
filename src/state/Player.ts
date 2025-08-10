import { DatabaseItem } from "./DatabaseItem";

export interface Player {
  name: string;
  profileUrl: string;
}

export interface DbPlayer extends Player, DatabaseItem {}

export interface PlayerWithStats extends DbPlayer {
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  startCount: number;
  startRate: number;
  startToWinRate: number;
  solRingCount: number;
  solRingRate: number;
  solRingToWinRate: number;
  grandSlamCount: number;
  deckPlayedMap: Map<string, number>;
  deckWonMap: Map<string, number>;
}
