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
import { getDeckIdentityLabel } from "../../utils/Deck";
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
  const { populatedDecks, populating } = usePopulatedDecks();
  const [search, setSearch] = useState<string>("");
  const [sortFctKey, setSortFctKey] = useState<DeckSortFctKey>(
    DeckSortFctKey.NAME_ASC
  );
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>([]);
  const [bracket, setBracket] = useState<Bracket>();
  const [identity, setIdentity] = useState<IdentityLabel>();
  const [filteredDecks, setFilteredDecks] = useState<DeckWithStats[]>([]);

  useEffect(() => {
    const filtered = cloneDeep(populatedDecks).filter((deck) => {
      const nameFilter =
        deck.name.toLowerCase().includes(search.toLowerCase()) ||
        deck.commander?.toLowerCase().includes(search.toLowerCase());
      const builderFilter =
        !visiblePlayers.length ||
        visiblePlayers.some((visiblePlayer) =>
          deck.builder?.includes(visiblePlayer)
        );
      const bracketFilter = !bracket || getBracket(deck) === bracket;
      const identityFilter =
        !identity || getDeckIdentityLabel(deck) === identity;
      return nameFilter && builderFilter && bracketFilter && identityFilter;
    });
    const sortFct = DECK_SORT_FCTS[sortFctKey].sortFct;
    const sorted = filtered.sort(sortFct);
    setFilteredDecks(sorted);
  }, [populatedDecks, sortFctKey, search, visiblePlayers, bracket, identity]);

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
    return populating;
  }

  function handleSort(value: string) {
    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  if (loading() || !populatedDecks.length) {
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
              value={sortFctKey}
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
          <div>
            <Heading className="mb-1" size="3">
              Bracket
            </Heading>
            <BracketSelect value={bracket as Bracket} onChange={setBracket} />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Identity
            </Heading>
            <IdentitySelect
              value={identity as IdentityLabel}
              onChange={setIdentity}
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
