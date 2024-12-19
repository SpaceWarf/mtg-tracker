import { createContext } from "react";

import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import { DbPlayer } from "../state/Player";

type DataContextType = {
  games: DbGame[];
  setGames: (games: DbGame[]) => void;
  players: DbPlayer[];
  setPlayers: (players: DbPlayer[]) => void;
  decks: DbDeck[];
  setDecks: (decks: DbDeck[]) => void;
};

export const DataContext = createContext<DataContextType | null>(null);
