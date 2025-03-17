import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Select, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { PlayerWithStats } from "../../state/Player";
import { PlayerSortFctKey } from "../../state/PlayerSortFctKey";
import { PLAYER_SORT_FCTS } from "../../state/PlayerSortFcts";
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
import { PlayerCreateModal } from "./PlayerCreateModal";
import { PlayersCardView } from "./PlayersCardView";

export function PlayersViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const [search, setSearch] = useState<string>("");
  const [sortFctKey, setSortFctKey] = useState<PlayerSortFctKey>(
    PlayerSortFctKey.NAME_ASC
  );
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
    const sortFct = PLAYER_SORT_FCTS[sortFctKey].sortFct;
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
      setSortFctKey(urlSortKey as PlayerSortFctKey);
    }
  }, [searchParams]);

  function loading(): boolean {
    return loadingGames || loadingPlayers || loadingDecks;
  }

  function handleSort(sortKey: PlayerSortFctKey) {
    searchParams.set("sort", sortKey);
    setSearchParams(searchParams);
  }

  if (loading() || !dbPlayers?.length || !dbGames?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full" style={{ maxWidth: "1750px" }}>
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
            <Select.Root
              value={sortFctKey}
              onValueChange={(value) => handleSort(value as PlayerSortFctKey)}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  {Object.values(PlayerSortFctKey).map((key) => (
                    <Select.Item key={key} value={key}>
                      {PLAYER_SORT_FCTS[key].name}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </Flex>
        <div>{auth.user && <PlayerCreateModal />}</div>
      </Flex>
      {filteredPlayers.length && dbDecks?.length ? (
        <PlayersCardView
          players={filteredPlayers}
          decks={dbDecks}
          highlightedKey={PLAYER_SORT_FCTS[sortFctKey].highlightedKey}
          highlightedDirection={
            PLAYER_SORT_FCTS[sortFctKey].highlightedDirection
          }
        />
      ) : (
        <div>No results for applied filters.</div>
      )}
    </div>
  );
}
