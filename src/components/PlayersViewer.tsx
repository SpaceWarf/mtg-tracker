import { Flex, Heading, Select, Spinner } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { PlayerWithStats } from "../state/Player";
import { PlayerSortFctKey } from "../state/PlayerSortFctKey";
import { PLAYER_SORT_FCTS } from "../state/PlayerSortFcts";
import {
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
} from "../utils/Player";
import { PlayerCreateModal } from "./PlayerCreateModal";
import { PlayersCardView } from "./PlayersCardView";

export function PlayersViewer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbGames, loadingGames } = useGames();
  const [sortFctKey, setSortFctKey] = useState<PlayerSortFctKey>(
    PlayerSortFctKey.NAME_ASC
  );
  const [playersWithStats, setPlayersWithStats] = useState<PlayerWithStats[]>(
    []
  );
  const [sortedPlayers, setSortedPlayers] = useState<PlayerWithStats[]>([]);

  const populatePlayerStats = useCallback(() => {
    if (dbPlayers && dbGames) {
      const populatedPlayers: PlayerWithStats[] = [];
      dbPlayers?.forEach((player) => {
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
        });
      });
      setPlayersWithStats(populatedPlayers);
    }
  }, [dbPlayers, dbGames]);

  useEffect(() => {
    const sortFct = PLAYER_SORT_FCTS[sortFctKey].sortFct;
    setSortedPlayers(cloneDeep(playersWithStats).sort(sortFct));
  }, [playersWithStats, sortFctKey]);

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
    return loadingGames || loadingPlayers;
  }

  function handleSort(sortKey: PlayerSortFctKey) {
    setSearchParams({
      sort: sortKey,
    });
  }

  if (loading() || !dbPlayers?.length || !dbGames?.length) {
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
        <div>
          <PlayerCreateModal />
        </div>
      </Flex>
      <PlayersCardView
        players={sortedPlayers}
        highlightedKey={PLAYER_SORT_FCTS[sortFctKey].highlightedKey}
        highlightedDirection={PLAYER_SORT_FCTS[sortFctKey].highlightedDirection}
      />
    </div>
  );
}
