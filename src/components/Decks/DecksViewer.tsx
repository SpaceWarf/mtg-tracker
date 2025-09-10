import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Spinner, TextField } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
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
import { BracketSelect } from "../Select/BracketSelect";
import { IdentitySelect } from "../Select/IdentitySelect";
import { PlayerSelect } from "../Select/PlayerSelect";
import { SortFctSelect } from "../Select/SortFctSelect";
import { DeckCreateModal } from "./DeckCreateModal";
import { DecksCardView } from "./DecksCardView";
import { DeckSyncModal } from "./DeckSyncModal";

export function DecksViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? ""
  );
  const [sortFctKey, setSortFctKey] = useState<DeckSortFctKey>(
    Object.values<string>(DeckSortFctKey).includes(
      searchParams.get("sort") ?? ""
    )
      ? (searchParams.get("sort") as DeckSortFctKey)
      : DeckSortFctKey.NAME_ASC
  );
  const [visiblePlayer, setVisiblePlayer] = useState<string>(
    searchParams.get("builder") ?? ""
  );
  const [bracket, setBracket] = useState<Bracket | undefined>(
    Object.values<string>(Bracket).includes(searchParams.get("bracket") ?? "")
      ? (searchParams.get("bracket") as Bracket)
      : undefined
  );
  const [identity, setIdentity] = useState<IdentityLabel | undefined>(
    Object.values<string>(IdentityLabel).includes(
      searchParams.get("identity") ?? ""
    )
      ? (searchParams.get("identity") as IdentityLabel)
      : undefined
  );

  const { populatedDecks, populating } = usePopulatedDecks();
  const [filteredDecks, setFilteredDecks] = useState<DeckWithStats[]>([]);

  useEffect(() => {
    const filtered = cloneDeep(populatedDecks).filter((deck) => {
      const nameFilter =
        deck.name.toLowerCase().includes(search.toLowerCase()) ||
        deck.commander?.toLowerCase().includes(search.toLowerCase());
      const builderFilter = !visiblePlayer || deck.builder === visiblePlayer;
      const bracketFilter =
        !bracket || (getBracket(deck) === bracket && deck.externalId);
      const identityFilter =
        !identity ||
        getColourIdentityLabel(deck.colourIdentity ?? []) === identity;
      return nameFilter && builderFilter && bracketFilter && identityFilter;
    });
    const sortFct = DECK_SORT_FCTS[sortFctKey].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredDecks(sorted);
  }, [populatedDecks, sortFctKey, search, visiblePlayer, bracket, identity]);

  function handleSearch(value: string) {
    setSearch(value);

    if (!value) {
      searchParams.delete("search");
    } else {
      searchParams.set("search", value);
    }
    setSearchParams(searchParams);
  }

  function handleSort(value: string) {
    setSortFctKey(value as DeckSortFctKey);

    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  function handleChangeBuilder(value: string) {
    setVisiblePlayer(value);

    if (!value) {
      searchParams.delete("builder");
    } else {
      searchParams.set("builder", value);
    }
    setSearchParams(searchParams);
  }

  function handleChangeBracket(value: Bracket) {
    setBracket(value);

    if (!value) {
      searchParams.delete("bracket");
    } else {
      searchParams.set("bracket", value);
    }
    setSearchParams(searchParams);
  }

  function handleChangeIdentity(value: IdentityLabel) {
    setIdentity(value);

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
    <div className="p-5 w-full max-w-[1750px]">
      <Flex className="mb-5" justify="between">
        <Flex gap="5" wrap="wrap">
          <div className="w-60">
            <Heading className="mb-1" size="3">
              Search
            </Heading>
            <TextField.Root
              className="input-field"
              placeholder="Search…"
              value={search}
              onChange={({ target }) => handleSearch(target.value)}
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
              value={sortFctKey}
              onChange={handleSort}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Builder
            </Heading>
            <PlayerSelect
              value={visiblePlayer}
              onChange={handleChangeBuilder}
              isMulti={false}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Bracket
            </Heading>
            <BracketSelect
              value={bracket as Bracket}
              onChange={handleChangeBracket}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Identity
            </Heading>
            <IdentitySelect
              value={identity as IdentityLabel}
              onChange={handleChangeIdentity}
            />
          </div>
        </Flex>
        {auth.user && (
          <Flex className="mt-6" align="center" gap="3">
            <DeckSyncModal />
            <DeckCreateModal />
          </Flex>
        )}
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
