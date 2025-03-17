import { createContext } from "react";

import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import { DbPlayer } from "../state/Player";
import { Year } from "../state/Year";

type DataContextType = {
  year: Year;
  setYear: (year: Year) => void;
  games: DbGame[];
  setGames: (games: DbGame[]) => void;
  players: DbPlayer[];
  setPlayers: (players: DbPlayer[]) => void;
  decks: DbDeck[];
  setDecks: (decks: DbDeck[]) => void;
};

export const DataContext = createContext<DataContextType>({
  year: Year.Y2025,
  setYear: () => {},
  games: [],
  setGames: () => {},
  players: [],
  setPlayers: () => {},
  decks: [],
  setDecks: () => {},
});
