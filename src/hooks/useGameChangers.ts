import { useMemo } from "react";
import { useDecks } from "./useDecks";

export function useGameChangers() {
  const { dbDecks, loadingDecks } = useDecks();

  const gameChangers = useMemo(() => {
    return dbDecks?.find((deck) => deck.gameChangersDeck)?.cards ?? [];
  }, [dbDecks]);

  return {
    gameChangers,
    loadingGameChangers: loadingDecks,
  };
}
