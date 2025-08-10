import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import { DeckWithStats } from "../../state/Deck";
import { DeckSortFctKey } from "../../state/DeckSortFctKey";
import { DECK_SORT_FCTS, getDeckSortFctName } from "../../state/DeckSortFcts";
import { SelectOption } from "../../state/SelectOption";
import {
  getDeckGamesCount,
  getDeckWinCount,
  getDeckWinRate,
} from "../../utils/Deck";
import { DeckCreateModal } from "./DeckCreateModal";
import { DecksCardView } from "./DecksCardView";

export function DecksViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const { dbPlayers, loadingPlayers } = usePlayers();
  const [search, setSearch] = useState<string>("");
  const [sortFctKey, setSortFctKey] = useState<SelectOption>({
    value: DeckSortFctKey.NAME_ASC,
    label: getDeckSortFctName(DeckSortFctKey.NAME_ASC),
  });
  const [visiblePlayers, setVisiblePlayers] = useState<
    MultiValue<SelectOption>
  >([]);
  const [decksWithStats, setDecksWithStats] = useState<DeckWithStats[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<DeckWithStats[]>([]);
  const playerSelectOptions = useSelectOptions(dbPlayers ?? [], "id", "name");

  const sortFctOptions = useMemo(() => {
    return Object.values(DeckSortFctKey).map((key) => ({
      value: key,
      label: getDeckSortFctName(key),
    }));
  }, []);

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
    const filtered = cloneDeep(decksWithStats).filter((deck) => {
      const nameFilter =
        deck.name.toLowerCase().includes(search.toLowerCase()) ||
        deck.commander.toLowerCase().includes(search.toLowerCase());
      const builderFilter =
        !visiblePlayers.length ||
        visiblePlayers.some((visiblePlayer) =>
          deck.builder?.includes(visiblePlayer.value)
        );
      return nameFilter && builderFilter;
    });
    const sortFct = DECK_SORT_FCTS[sortFctKey.value].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredDecks(sorted);
  }, [decksWithStats, sortFctKey, search, visiblePlayers]);

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
      setSortFctKey({
        value: urlSortKey as DeckSortFctKey,
        label: getDeckSortFctName(urlSortKey as DeckSortFctKey),
      });
    }
  }, [searchParams]);

  function loading(): boolean {
    return loadingGames || loadingDecks || loadingPlayers;
  }

  function handleSort(sortKey: SingleValue<SelectOption>) {
    if (!sortKey) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", sortKey.value);
    }
    setSearchParams(searchParams);
  }

  if (loading() || !dbDecks?.length || !dbGames?.length || !dbPlayers?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full" style={{ maxWidth: "1750px" }}>
      <Flex className="mb-5" justify="between">
        <Flex gap="5">
          <div className="w-60">
            <Heading className="mb-1" size="3">
              Search
            </Heading>
            <TextField.Root
              className="input-field"
              placeholder="Search…"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Sort by
            </Heading>
            <ReactSelect
              className="react-select-container min-w-40"
              classNamePrefix="react-select"
              name="sortFct"
              options={sortFctOptions}
              value={sortFctKey}
              onChange={handleSort}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Include players
            </Heading>
            <ReactSelect
              className="react-select-container min-w-60"
              classNamePrefix="react-select"
              name="visiblePlayers"
              options={playerSelectOptions}
              value={visiblePlayers}
              onChange={setVisiblePlayers}
              isMulti
              closeMenuOnSelect={false}
            />
          </div>
        </Flex>
        <div>{auth.user && <DeckCreateModal />}</div>
      </Flex>
      {filteredDecks.length ? (
        <DecksCardView
          decks={filteredDecks}
          highlightedKey={DECK_SORT_FCTS[sortFctKey.value].highlightedKey}
          highlightedDirection={
            DECK_SORT_FCTS[sortFctKey.value].highlightedDirection
          }
        />
      ) : (
        <div>No results for applied filters.</div>
      )}
    </div>
  );
}
