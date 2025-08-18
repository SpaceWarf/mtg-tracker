import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { DeckWithStats } from "../../state/Deck";
import { DeckSortFctKey } from "../../state/DeckSortFctKey";
import { DECK_SORT_FCTS, getDeckSortFctName } from "../../state/DeckSortFcts";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import {
  getDeckGameChanger,
  getDeckGamesCount,
  getDeckWinCount,
  getDeckWinRate,
} from "../../utils/Deck";
import { PlayerSelect } from "../Select/PlayerSelect";
import { SortFctSelect } from "../Select/SortFctSelect";
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
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>([]);
  const [decksWithStats, setDecksWithStats] = useState<DeckWithStats[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<DeckWithStats[]>([]);
  const gameChangers = useMemo(() => {
    return dbDecks?.find((deck) => deck.gameChangersDeck)?.cards ?? [];
  }, [dbDecks]);

  const populateDeckStats = useCallback(() => {
    if (dbDecks && dbGames) {
      const populatedDecks: DeckWithStats[] = [];
      dbDecks
        .filter((deck) => !deck.gameChangersDeck)
        .forEach((deck) => {
          populatedDecks.push({
            ...cloneDeep(deck),
            gamesPlayed: getDeckGamesCount(deck, dbGames),
            winCount: getDeckWinCount(deck, dbGames),
            winRate: getDeckWinRate(deck, dbGames),
            gameChangers: getDeckGameChanger(deck, gameChangers),
          });
        });
      setDecksWithStats(populatedDecks);
    }
  }, [dbDecks, dbGames, gameChangers]);

  useEffect(() => {
    const filtered = cloneDeep(decksWithStats).filter((deck) => {
      const nameFilter =
        deck.name.toLowerCase().includes(search.toLowerCase()) ||
        deck.commander?.toLowerCase().includes(search.toLowerCase());
      const builderFilter =
        !visiblePlayers.length ||
        visiblePlayers.some((visiblePlayer) =>
          deck.builder?.includes(visiblePlayer)
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

  function handleSort(value: string) {
    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
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
            <SortFctSelect
              type={SortFctType.DECK}
              value={sortFctKey.value}
              onChange={handleSort}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Include players
            </Heading>
            <PlayerSelect
              value={visiblePlayers}
              onChange={setVisiblePlayers}
              isMulti
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
