import { Flex, Heading, Select, Spinner } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDecks } from "../hooks/useDecks";
import { useGames } from "../hooks/useGames";
import { DeckWithStats } from "../state/Deck";
import { DeckSortFctKey } from "../state/DeckSortFctKey";
import { DECK_SORT_FCTS } from "../state/DeckSortFcts";
import {
  getDeckGamesCount,
  getDeckWinCount,
  getDeckWinRate,
} from "../utils/Deck";
import { DeckCreateModal } from "./DeckCreateModal";
import { DecksCardView } from "./DecksCardView";

export function DecksViewer() {
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const [sortFctKey, setSortFctKey] = useState<DeckSortFctKey>(
    DeckSortFctKey.NAME_ASC
  );
  const [decksWithStats, setDecksWithStats] = useState<DeckWithStats[]>([]);
  const [sortedDecks, setSortedDecks] = useState<DeckWithStats[]>([]);

  const populateDeckStats = useCallback(() => {
    if (dbDecks && dbGames) {
      const populatedDecks: DeckWithStats[] = [];
      dbDecks.forEach((deck) => {
        populatedDecks.push({
          ...cloneDeep(deck),
          gamesPlayed: getDeckGamesCount(deck, dbGames),
          winCount: getDeckWinCount(deck, dbGames),
          winRate: getDeckWinRate(deck, dbGames),
        });
      });
      setDecksWithStats(populatedDecks);
    }
  }, [dbDecks, dbGames]);

  useEffect(() => {
    const sortFct = DECK_SORT_FCTS[sortFctKey].sortFct;
    setSortedDecks(cloneDeep(decksWithStats).sort(sortFct));
  }, [decksWithStats, sortFctKey]);

  useEffect(() => {
    if (!loadingDecks && !loadingGames) {
      populateDeckStats();
    }
  }, [loadingDecks, loadingGames, populateDeckStats]);

  function loading(): boolean {
    return loadingGames || loadingDecks;
  }

  if (loading() || !dbDecks?.length || !dbGames?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="m-5 max-w-7xl">
      <Flex className="mb-5" justify="between" align="center">
        <div>
          <Heading className="mb-1" size="3">
            Sort by
          </Heading>
          <Select.Root
            value={sortFctKey}
            onValueChange={(value) => setSortFctKey(value as DeckSortFctKey)}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                {Object.values(DeckSortFctKey).map((key) => (
                  <Select.Item key={key} value={key}>
                    {DECK_SORT_FCTS[key].name}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <div>
          <DeckCreateModal />
        </div>
      </Flex>
      <DecksCardView
        decks={sortedDecks}
        highlightedKey={DECK_SORT_FCTS[sortFctKey].highlightedKey}
        highlightedDirection={DECK_SORT_FCTS[sortFctKey].highlightedDirection}
      />
    </div>
  );
}
