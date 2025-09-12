import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Grid, Heading, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { FiltersContext } from "../../contexts/FiltersContext";
import { useAuth } from "../../hooks/useAuth";
import { usePopulatedDecks } from "../../hooks/usePopulatedDecks";
import { Bracket } from "../../state/Bracket";
import { DeckWithStats } from "../../state/Deck";
import { DeckSortFctKey } from "../../state/DeckSortFctKey";
import { DECK_SORT_FCTS } from "../../state/DeckSortFcts";
import { IdentityLabel } from "../../state/IdentityLabel";
import { SortFctType } from "../../state/SortFctType";
import { getBracket } from "../../utils/Bracket";
import { getColourIdentityLabel } from "../../utils/Deck";
import { DataCard } from "../Common/DataCard";
import { Icon } from "../Common/Icon";
import { NoResults } from "../Common/NoResults";
import { BracketSelect } from "../Common/Select/BracketSelect";
import { IdentitySelect } from "../Common/Select/IdentitySelect";
import { PlayerSelect } from "../Common/Select/PlayerSelect";
import { SortFctSelect } from "../Common/Select/SortFctSelect";
import { DeckCreateModal } from "./DeckCreateModal";
import { DecksCardView } from "./DecksCardView";
import { DeckSyncModal } from "./DeckSyncModal";

export function DecksViewer() {
  const {
    deckSearch,
    setDeckSearch,
    deckSortBy,
    setDeckSortBy,
    deckBuilder,
    setDeckBuilder,
    deckBracket,
    setDeckBracket,
    deckIdentity,
    setDeckIdentity,
  } = useContext(FiltersContext);

  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { populatedDecks, populating } = usePopulatedDecks();

  const [filteredDecks, setFilteredDecks] = useState<DeckWithStats[]>([]);

  const hasFiltersApplied = useMemo(() => {
    return (
      deckSearch.length > 0 ||
      deckBuilder.length > 0 ||
      deckBracket ||
      deckIdentity
    );
  }, [deckSearch, deckBuilder, deckBracket, deckIdentity]);

  useEffect(() => {
    const filtered = cloneDeep(populatedDecks).filter((deck) => {
      const nameFilter =
        deck.name.toLowerCase().includes(deckSearch.toLowerCase()) ||
        deck.commander?.toLowerCase().includes(deckSearch.toLowerCase());
      const builderFilter = !deckBuilder || deck.builder === deckBuilder;
      const bracketFilter =
        !deckBracket || (getBracket(deck) === deckBracket && deck.externalId);
      const identityFilter =
        !deckIdentity ||
        getColourIdentityLabel(deck.colourIdentity ?? []) === deckIdentity;
      return nameFilter && builderFilter && bracketFilter && identityFilter;
    });
    const sortFct = DECK_SORT_FCTS[deckSortBy].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredDecks(sorted);
  }, [
    populatedDecks,
    deckSortBy,
    deckSearch,
    deckBuilder,
    deckBracket,
    deckIdentity,
  ]);

  useEffect(() => {
    const params: Record<string, string> = {
      sort: searchParams.get("sort") ?? deckSortBy,
      search: searchParams.get("search") ?? deckSearch,
      builder: searchParams.get("builder") ?? deckBuilder,
      bracket: searchParams.get("bracket") ?? deckBracket,
      identity: searchParams.get("identity") ?? deckIdentity,
    };

    if (params.search) {
      setDeckSearch(params.search);
    } else {
      delete params.search;
    }

    if (params.builder) {
      setDeckBuilder(params.builder);
    } else {
      delete params.builder;
    }

    if (params.bracket) {
      setDeckBracket(params.bracket as Bracket);
    } else {
      delete params.bracket;
    }

    if (params.identity) {
      setDeckIdentity(params.identity as IdentityLabel);
    } else {
      delete params.identity;
    }

    setSearchParams(params);

    // We only want to run this effect once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(value: string) {
    setDeckSearch(value);

    if (!value) {
      searchParams.delete("search");
    } else {
      searchParams.set("search", value);
    }
    setSearchParams(searchParams);
  }

  function handleSort(value: string) {
    setDeckSortBy(value as DeckSortFctKey);

    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  function handleChangeBuilder(value: string) {
    setDeckBuilder(value);

    if (!value) {
      searchParams.delete("builder");
    } else {
      searchParams.set("builder", value);
    }
    setSearchParams(searchParams);
  }

  function handleChangeBracket(value: Bracket) {
    setDeckBracket(value);

    if (!value) {
      searchParams.delete("bracket");
    } else {
      searchParams.set("bracket", value);
    }
    setSearchParams(searchParams);
  }

  function handleChangeIdentity(value: IdentityLabel) {
    setDeckIdentity(value);

    if (!value) {
      searchParams.delete("identity");
    } else {
      searchParams.set("identity", value);
    }
    setSearchParams(searchParams);
  }

  if (populating || !populatedDecks.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full max-w-[1950px]">
      <Grid columns="1" gap="5">
        <DataCard
          title="Decks"
          icon={<Icon icon="cards-blank" />}
          direction="row"
        >
          {auth.user && (
            <Grid width="250px" gap="3" columns="2">
              <DeckSyncModal />
              <DeckCreateModal />
            </Grid>
          )}
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
                value={deckSearch}
                onChange={({ target }) => handleSearch(target.value)}
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
                type={SortFctType.DECK}
                value={deckSortBy}
                onChange={handleSort}
              />
            </Box>
            <Box>
              <Heading className="mb-1" size="3">
                Builder
              </Heading>
              <PlayerSelect
                value={deckBuilder}
                onChange={handleChangeBuilder}
                isMulti={false}
              />
            </Box>
            <Box>
              <Heading className="mb-1" size="3">
                Bracket
              </Heading>
              <BracketSelect
                value={deckBracket as Bracket}
                onChange={handleChangeBracket}
              />
            </Box>
            <Box>
              <Heading className="mb-1" size="3">
                Identity
              </Heading>
              <IdentitySelect
                value={deckIdentity as IdentityLabel}
                onChange={handleChangeIdentity}
              />
            </Box>
          </Grid>
        </DataCard>
        {filteredDecks.length ? (
          <DecksCardView
            decks={filteredDecks}
            highlightedKey={DECK_SORT_FCTS[deckSortBy].highlightedKey}
            highlightedDirection={
              DECK_SORT_FCTS[deckSortBy].highlightedDirection
            }
          />
        ) : (
          <NoResults />
        )}
      </Grid>
    </div>
  );
}
