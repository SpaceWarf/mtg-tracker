import { ReactElement, useState } from "react";

import { Bracket } from "../state/Bracket";
import { DeckSortFctKey } from "../state/DeckSortFctKey";
import { GameSortFctKey } from "../state/GameSortFctKey";
import { IdentityLabel } from "../state/IdentityLabel";
import { PlayerSortFctKey } from "../state/PlayerSortFctKey";
import { FiltersContext } from "./FiltersContext";

export function FiltersProvider({ children }: { children: ReactElement }) {
  const [gameSortBy, setGameSortBy] = useState<GameSortFctKey>(
    GameSortFctKey.DATE_DESC
  );
  const [gameIncludedPlayers, setGameIncludedPlayers] = useState<string[]>([]);
  const [gameExcludedPlayers, setGameExcludedPlayers] = useState<string[]>([]);
  const [gameIncludedDecks, setGameIncludedDecks] = useState<string[]>([]);
  const [gameExcludedDecks, setGameExcludedDecks] = useState<string[]>([]);

  const [playerSearch, setPlayerSearch] = useState<string>("");
  const [playerSortBy, setPlayerSortBy] = useState<PlayerSortFctKey>(
    PlayerSortFctKey.NAME_ASC
  );

  const [deckSearch, setDeckSearch] = useState<string>("");
  const [deckSortBy, setDeckSortBy] = useState<DeckSortFctKey>(
    DeckSortFctKey.NAME_ASC
  );
  const [deckBuilder, setDeckBuilder] = useState<string>("");
  const [deckBracket, setDeckBracket] = useState<Bracket>("" as Bracket);
  const [deckIdentity, setDeckIdentity] = useState<IdentityLabel>(
    "" as IdentityLabel
  );

  return (
    <FiltersContext.Provider
      value={{
        gameSortBy,
        setGameSortBy,
        gameIncludedPlayers,
        setGameIncludedPlayers,
        gameExcludedPlayers,
        setGameExcludedPlayers,
        gameIncludedDecks,
        setGameIncludedDecks,
        gameExcludedDecks,
        setGameExcludedDecks,
        playerSearch,
        setPlayerSearch,
        playerSortBy,
        setPlayerSortBy,
        deckSearch,
        setDeckSearch,
        deckSortBy,
        setDeckSortBy,
        deckBuilder,
        setDeckBuilder,
        deckBracket,
        setDeckBracket,
        deckIdentity,
        setDeckIdentity,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}
