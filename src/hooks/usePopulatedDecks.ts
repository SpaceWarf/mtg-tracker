import { useEffect, useMemo, useState } from "react";
import { DeckWithStats } from "../state/Deck";
import { populateDeck } from "../utils/Deck";
import { useDecks } from "./useDecks";
import { useGames } from "./useGames";

export function usePopulatedDecks() {
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const [populated, setPopulated] = useState(false);
  const [populatedDecks, setPopulatedDecks] = useState<DeckWithStats[]>([]);

  const gameChangers = useMemo(() => {
    return dbDecks?.find((deck) => deck.gameChangersDeck)?.cards ?? [];
  }, [dbDecks]);

  const populating = useMemo(() => {
    return loadingDecks || loadingGames || !populated;
  }, [loadingDecks, loadingGames, populated]);

  useEffect(() => {
    setPopulated(false);
    let populatedDecks: DeckWithStats[] = [];

    if (dbDecks && dbGames) {
      populatedDecks = dbDecks
        .filter((deck) => !deck.gameChangersDeck)
        .map((deck) => populateDeck(deck, dbGames, gameChangers));
    }

    setPopulatedDecks(populatedDecks);
    setPopulated(true);
  }, [dbDecks, dbGames, gameChangers]);

  return {
    populatedDecks,
    populating,
  };
}
