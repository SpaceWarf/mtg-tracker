import { faFilter, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Grid, Heading, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { usePopulatedPlayers } from "../../hooks/usePopulatedPlayers";
import { PlayerWithStats } from "../../state/Player";
import { PlayerSortFctKey } from "../../state/PlayerSortFctKey";
import {
  getPlayerSortFctName,
  PLAYER_SORT_FCTS,
} from "../../state/PlayerSortFcts";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import { DataCard } from "../Common/DataCard";
import { NoResults } from "../Common/NoResults";
import { SortFctSelect } from "../Common/Select/SortFctSelect";
import { PlayerCreateModal } from "./PlayerCreateModal";
import { PlayersCardView } from "./PlayersCardView";

export function PlayersViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [sortFctKey, setSortFctKey] = useState<SelectOption>({
    value: PlayerSortFctKey.NAME_ASC,
    label: getPlayerSortFctName(PlayerSortFctKey.NAME_ASC),
  });

  const { populatedPlayers, populating } = usePopulatedPlayers();
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerWithStats[]>([]);

  useEffect(() => {
    const filtered = cloneDeep(populatedPlayers).filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    );
    const sortFct = PLAYER_SORT_FCTS[sortFctKey.value].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredPlayers(sorted);
  }, [populatedPlayers, sortFctKey, search]);

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

  function handleSort(value: string) {
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
          icon={<FontAwesomeIcon icon={faUsers} />}
          direction="row"
        >
          <Grid width="125px" gap="3" columns="1">
            {auth.user && <PlayerCreateModal />}
          </Grid>
        </DataCard>
        <DataCard
          title="Filters"
          icon={<FontAwesomeIcon icon={faFilter} />}
          collapsable
          defaultCollapsed
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
                value={search}
                onChange={({ target }) => setSearch(target.value)}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            <Box>
              <Heading className="mb-1" size="3">
                Sort by
              </Heading>
              <SortFctSelect
                type={SortFctType.PLAYER}
                value={sortFctKey.value}
                onChange={handleSort}
              />
            </Box>
          </Grid>
        </DataCard>
        {filteredPlayers.length ? (
          <PlayersCardView
            players={filteredPlayers}
            highlightedKey={PLAYER_SORT_FCTS[sortFctKey.value].highlightedKey}
            highlightedDirection={
              PLAYER_SORT_FCTS[sortFctKey.value].highlightedDirection
            }
          />
        ) : (
          <NoResults />
        )}
      </Grid>
    </div>
  );
}
