import { Flex, Heading, Select, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const [search, setSearch] = useState<string>("");
  const [sortFctKey, setSortFctKey] = useState<DeckSortFctKey>(
    DeckSortFctKey.NAME_ASC
  );
  const [decksWithStats, setDecksWithStats] = useState<DeckWithStats[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<DeckWithStats[]>([]);

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
    const filtered = cloneDeep(decksWithStats).filter(
      (deck) =>
        deck.name.toLowerCase().includes(search.toLowerCase()) ||
        deck.commander.toLowerCase().includes(search.toLowerCase())
    );
    const sortFct = DECK_SORT_FCTS[sortFctKey].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredDecks(sorted);
  }, [decksWithStats, sortFctKey, search]);

  useEffect(() => {
    if (!loadingDecks && !loadingGames) {
      populateDeckStats();
    }
  }, [loadingDecks, loadingGames, populateDeckStats]);

  useEffect(() => {
    const urlSortKey = searchParams.get("sort");
    if (
      urlSortKey &&
      Object.values<string>(DeckSortFctKey).includes(urlSortKey)
    ) {
      setSortFctKey(urlSortKey as DeckSortFctKey);
    }
  }, [searchParams]);

  function loading(): boolean {
    return loadingGames || loadingDecks;
  }

  function handleSort(sortKey: DeckSortFctKey) {
    setSearchParams({
      sort: sortKey,
    });
  }

  if (loading() || !dbDecks?.length || !dbGames?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full">
      <Flex className="mb-5" justify="between" align="end">
        <Flex gap="5">
          <div className="w-60">
            <Heading className="mb-1" size="3">
              Search
            </Heading>
            <TextField.Root
              placeholder="Search…"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            ></TextField.Root>
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Sort by
            </Heading>
            <Select.Root
              value={sortFctKey}
              onValueChange={(value) => handleSort(value as DeckSortFctKey)}
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
        </Flex>
        <div>
          <DeckCreateModal />
        </div>
      </Flex>
      {filteredDecks.length ? (
        <DecksCardView
          decks={filteredDecks}
          highlightedKey={DECK_SORT_FCTS[sortFctKey].highlightedKey}
          highlightedDirection={DECK_SORT_FCTS[sortFctKey].highlightedDirection}
        />
      ) : (
        <div>No results for applied filters.</div>
      )}
    </div>
  );
}
