import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { DeckWithStats } from "../state/Deck";
import {
  getDeckExtraTurn,
  getDeckGameChanger,
  getDeckGamesCount,
  getDeckMassLandDenial,
  getDeckTutor,
  getDeckWinCount,
  getDeckWinRate,
} from "../utils/Deck";
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
        .map((deck) => ({
          ...cloneDeep(deck),
          gamesPlayed: getDeckGamesCount(deck, dbGames),
          winCount: getDeckWinCount(deck, dbGames),
          winRate: getDeckWinRate(deck, dbGames),
          gameChangers: getDeckGameChanger(deck, gameChangers),
          massLandDenials: getDeckMassLandDenial(deck),
          extraTurns: getDeckExtraTurn(deck),
          tutors: getDeckTutor(deck),
          combos: (deck.possibleCombos ?? []).filter((possibleCombo) =>
            possibleCombo.cards.every((comboCard) =>
              deck.cards?.find((card) => card.name === comboCard)
            )
          ),
        }));
    }

    setPopulatedDecks(populatedDecks);
    setPopulated(true);
  }, [dbDecks, dbGames, gameChangers]);

  return {
    populatedDecks,
    populating,
  };
}
