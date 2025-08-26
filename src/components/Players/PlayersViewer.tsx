import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { PlayerWithStats } from "../../state/Player";
import { PlayerSortFctKey } from "../../state/PlayerSortFctKey";
import {
  getPlayerSortFctName,
  PLAYER_SORT_FCTS,
} from "../../state/PlayerSortFcts";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import {
  getPlayerDecksPlayedMap,
  getPlayerDecksWonMap,
  getPlayerGamesCount,
  getPlayerGamesStarted,
  getPlayerGamesStartedRate,
  getPlayerGamesStartedToWinRate,
  getPlayerGrandSlamCount,
  getPlayerSolRingCount,
  getPlayerSolRingRate,
  getPlayerSolRingToWinRate,
  getPlayerWinCount,
  getPlayerWinRate,
} from "../../utils/Player";
import { SortFctSelect } from "../Select/SortFctSelect";
import { PlayerCreateModal } from "./PlayerCreateModal";
import { PlayersCardView } from "./PlayersCardView";

export function PlayersViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const [search, setSearch] = useState<string>("");
  const [sortFctKey, setSortFctKey] = useState<SelectOption>({
    value: PlayerSortFctKey.NAME_ASC,
    label: getPlayerSortFctName(PlayerSortFctKey.NAME_ASC),
  });
  const [playersWithStats, setPlayersWithStats] = useState<PlayerWithStats[]>(
    []
  );
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerWithStats[]>([]);

  const populatePlayerStats = useCallback(() => {
    if (dbPlayers && dbGames) {
      const populatedPlayers: PlayerWithStats[] = [];
      dbPlayers?.forEach((player) => {
        const deckPlayedMap = getPlayerDecksPlayedMap(player, dbGames);
        const deckWonMap = getPlayerDecksWonMap(player, dbGames);
        populatedPlayers.push({
          ...cloneDeep(player),
          gamesPlayed: getPlayerGamesCount(player, dbGames),
          winCount: getPlayerWinCount(player, dbGames),
          winRate: getPlayerWinRate(player, dbGames),
          startCount: getPlayerGamesStarted(player, dbGames),
          startRate: getPlayerGamesStartedRate(player, dbGames),
          startToWinRate: getPlayerGamesStartedToWinRate(player, dbGames),
          solRingCount: getPlayerSolRingCount(player, dbGames),
          solRingRate: getPlayerSolRingRate(player, dbGames),
          solRingToWinRate: getPlayerSolRingToWinRate(player, dbGames),
          grandSlamCount: getPlayerGrandSlamCount(player, dbGames),
          deckPlayedMap,
          deckWonMap,
        });
      });
      setPlayersWithStats(populatedPlayers);
    }
  }, [dbPlayers, dbGames]);

  useEffect(() => {
    const filtered = cloneDeep(playersWithStats).filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    );
    const sortFct = PLAYER_SORT_FCTS[sortFctKey.value].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredPlayers(sorted);
  }, [playersWithStats, sortFctKey, search]);

  useEffect(() => {
    if (!loadingPlayers && !loadingGames) {
      populatePlayerStats();
    }
  }, [loadingPlayers, loadingGames, populatePlayerStats]);

  useEffect(() => {
    const urlSortKey = searchParams.get("sort");
    if (
      urlSortKey &&
      Object.values<string>(PlayerSortFctKey).includes(urlSortKey)
    ) {
      setSortFctKey({
        value: urlSortKey as PlayerSortFctKey,
        label: getPlayerSortFctName(urlSortKey as PlayerSortFctKey),
      });
    }
  }, [searchParams]);

  function loading(): boolean {
    return loadingGames || loadingPlayers || loadingDecks;
  }

  function handleSort(value: string) {
    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  if (loading() || !dbPlayers?.length || !dbGames?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full max-w-[1750px]">
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
            <div>
              <Heading className="mb-1" size="3">
                Sort by
              </Heading>
              <SortFctSelect
                type={SortFctType.PLAYER}
                value={sortFctKey.value}
                onChange={handleSort}
              />
            </div>
          </div>
        </Flex>
        <div>{auth.user && <PlayerCreateModal />}</div>
      </Flex>
      {filteredPlayers.length && dbDecks?.length ? (
        <PlayersCardView
          players={filteredPlayers}
          decks={dbDecks}
          highlightedKey={PLAYER_SORT_FCTS[sortFctKey.value].highlightedKey}
          highlightedDirection={
            PLAYER_SORT_FCTS[sortFctKey.value].highlightedDirection
          }
        />
      ) : (
        <div>No results for applied filters.</div>
      )}
    </div>
  );
}
