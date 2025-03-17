import { ReactElement, useState } from "react";

import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import { DbPlayer } from "../state/Player";
import { Year } from "../state/Year";
import { DataContext } from "./DataContext";

export function DataProvider({ children }: { children: ReactElement }) {
  const [year, setYear] = useState(Year.Y2025);
  const [games, setGames] = useState<DbGame[]>([]);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [decks, setDecks] = useState<DbDeck[]>([]);

  return (
    <DataContext.Provider
      value={{
        year,
        setYear,
        games,
        setGames,
        players,
        setPlayers,
        decks,
        setDecks,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
