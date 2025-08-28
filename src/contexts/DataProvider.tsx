import { ReactElement, useState } from "react";

import { CacheKey } from "../state/CacheKey";
import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import { DbPlayer } from "../state/Player";
import { Year } from "../state/Year";
import { DataContext } from "./DataContext";

export function DataProvider({ children }: { children: ReactElement }) {
  const [year, setYear] = useState(
    (localStorage.getItem(CacheKey.YEAR) as Year) ?? Year.ALL
  );
  const [games, setGames] = useState<DbGame[]>([]);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [decks, setDecks] = useState<DbDeck[]>([]);

  function handleSetYear(year: Year) {
    setYear(year);
    localStorage.setItem(CacheKey.YEAR, year);
  }

  return (
    <DataContext.Provider
      value={{
        year,
        setYear: handleSetYear,
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
