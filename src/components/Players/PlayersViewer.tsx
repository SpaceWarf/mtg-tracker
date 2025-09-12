import { Box, Grid, Heading, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { FiltersContext } from "../../contexts/FiltersContext";
import { useAuth } from "../../hooks/useAuth";
import { usePopulatedPlayers } from "../../hooks/usePopulatedPlayers";
import { PlayerWithStats } from "../../state/Player";
import { PlayerSortFctKey } from "../../state/PlayerSortFctKey";
import { PLAYER_SORT_FCTS } from "../../state/PlayerSortFcts";
import { SortFctType } from "../../state/SortFctType";
import { DataCard } from "../Common/DataCard";
import { Icon } from "../Common/Icon";
import { NoResults } from "../Common/NoResults";
import { SortFctSelect } from "../Common/Select/SortFctSelect";
import { PlayerCreateModal } from "./PlayerCreateModal";
import { PlayersCardView } from "./PlayersCardView";

export function PlayersViewer() {
  const { playerSortBy, setPlayerSortBy, playerSearch, setPlayerSearch } =
    useContext(FiltersContext);

  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { populatedPlayers, populating } = usePopulatedPlayers();

  const [filteredPlayers, setFilteredPlayers] = useState<PlayerWithStats[]>([]);

  const hasFiltersApplied = useMemo(() => {
    return playerSearch.length > 0;
  }, [playerSearch]);

  useEffect(() => {
    const filtered = cloneDeep(populatedPlayers).filter((player) =>
      player.name.toLowerCase().includes(playerSearch.toLowerCase())
    );
    const sortFct = PLAYER_SORT_FCTS[playerSortBy].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredPlayers(sorted);
  }, [populatedPlayers, playerSortBy, playerSearch]);

  useEffect(() => {
    const params: Record<string, string> = {
      sort: searchParams.get("sort") ?? playerSortBy,
      search: searchParams.get("search") ?? playerSearch,
    };

    if (params.search) {
      setPlayerSearch(params.search);
    } else {
      delete params.search;
    }

    if (
      params.sort &&
      Object.values<string>(PlayerSortFctKey).includes(params.sort)
    ) {
      setPlayerSortBy(params.sort as PlayerSortFctKey);
    } else {
      delete params.sort;
    }

    setSearchParams(params);

    // We only want to run this effect once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(value: string) {
    setPlayerSearch(value);

    if (!value) {
      searchParams.delete("search");
    } else {
      searchParams.set("search", value);
    }
    setSearchParams(searchParams);
  }

  function handleSort(value: string) {
    setPlayerSortBy(value as PlayerSortFctKey);

    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  if (populating) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full max-w-[1950px]">
      <Grid columns="1" gap="5">
        <DataCard
          title="Players"
          icon={<Icon icon="users" />}
          direction="row"
          pageHeader
        >
          <Grid width="125px" gap="3" columns="1">
            {auth.user && <PlayerCreateModal />}
          </Grid>
        </DataCard>
        <DataCard
          title="Filters"
          icon={<Icon icon="filter" />}
          collapsable
          defaultCollapsed={!hasFiltersApplied}
        >
          <Grid
            gap="5"
            columns={{ initial: "1", xs: "2", sm: "3", md: "4", lg: "5" }}
          >
            <Box>
              <Heading className="mb-1" size="3">
                Search
              </Heading>
              <TextField.Root
                className="input-field"
                placeholder="Search…"
                value={playerSearch}
                onChange={({ target }) => handleSearch(target.value)}
              >
                <TextField.Slot>
                  <Icon icon="magnifying-glass" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            <Box>
              <Heading className="mb-1" size="3">
                Sort by
              </Heading>
              <SortFctSelect
                type={SortFctType.PLAYER}
                value={playerSortBy}
                onChange={handleSort}
              />
            </Box>
          </Grid>
        </DataCard>
        {filteredPlayers.length ? (
          <PlayersCardView
            players={filteredPlayers}
            highlightedKey={PLAYER_SORT_FCTS[playerSortBy].highlightedKey}
            highlightedDirection={
              PLAYER_SORT_FCTS[playerSortBy].highlightedDirection
            }
          />
        ) : (
          <NoResults />
        )}
      </Grid>
    </div>
  );
}
