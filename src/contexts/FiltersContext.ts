import { createContext } from "react";

import { Bracket } from "../state/Bracket";
import { DeckSortFctKey } from "../state/DeckSortFctKey";
import { GameSortFctKey } from "../state/GameSortFctKey";
import { IdentityLabel } from "../state/IdentityLabel";
import { PlayerSortFctKey } from "../state/PlayerSortFctKey";

type FiltersContextType = {
  gameSortBy: GameSortFctKey;
  setGameSortBy: (gameSortBy: GameSortFctKey) => void;
  gameIncludedPlayers: string[];
  setGameIncludedPlayers: (gameIncludedPlayers: string[]) => void;
  gameExcludedPlayers: string[];
  setGameExcludedPlayers: (gameExcludedPlayers: string[]) => void;
  gameIncludedDecks: string[];
  setGameIncludedDecks: (gameIncludedDecks: string[]) => void;
  gameExcludedDecks: string[];
  setGameExcludedDecks: (gameExcludedDecks: string[]) => void;

  playerSearch: string;
  setPlayerSearch: (playerSearch: string) => void;
  playerSortBy: PlayerSortFctKey;
  setPlayerSortBy: (playerSortBy: PlayerSortFctKey) => void;

  deckSearch: string;
  setDeckSearch: (deckSearch: string) => void;
  deckSortBy: DeckSortFctKey;
  setDeckSortBy: (deckSortBy: DeckSortFctKey) => void;
  deckBuilder: string;
  setDeckBuilder: (deckBuilder: string) => void;
  deckBracket: Bracket;
  setDeckBracket: (deckBracket: Bracket) => void;
  deckIdentity: IdentityLabel;
  setDeckIdentity: (deckIdentity: IdentityLabel) => void;
};

export const FiltersContext = createContext<FiltersContextType>({
  gameSortBy: GameSortFctKey.DATE_DESC,
  setGameSortBy: () => {},
  gameIncludedPlayers: [],
  setGameIncludedPlayers: () => {},
  gameExcludedPlayers: [],
  setGameExcludedPlayers: () => {},
  gameIncludedDecks: [],
  setGameIncludedDecks: () => {},
  gameExcludedDecks: [],
  setGameExcludedDecks: () => {},

  playerSearch: "",
  setPlayerSearch: () => {},
  playerSortBy: PlayerSortFctKey.NAME_ASC,
  setPlayerSortBy: () => {},

  deckSearch: "",
  setDeckSearch: () => {},
  deckSortBy: DeckSortFctKey.NAME_ASC,
  setDeckSortBy: () => {},
  deckBuilder: "",
  setDeckBuilder: () => {},
  deckBracket: "" as Bracket,
  setDeckBracket: () => {},
  deckIdentity: "" as IdentityLabel,
  setDeckIdentity: () => {},
});
