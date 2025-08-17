import { ExternalLinkIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Spinner } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDecks } from "../../hooks/useDecks";
import { ArchidektService } from "../../services/Archidekt";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { DbDeck } from "../../state/Deck";
import { CardList } from "../Cards/CardList";
import { CardListFilters } from "../Cards/CardListFilters";

export function GameChangersViewer() {
  const navigate = useNavigate();
  const { dbDecks } = useDecks();
  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [deck, setDeck] = useState<DbDeck>();
  const [syncing, setSyncing] = useState<boolean>(false);

  useEffect(() => {
    const deck = dbDecks?.find((deck) => deck.gameChangersDeck);
    if (deck) {
      setDeck(deck);
    }
  }, [dbDecks]);

  function handleCardListFiltersChange(
    groupBy: CardGroupBy,
    sortBy: CardSortFctKey,
    search: string
  ) {
    setGroupBy(groupBy);
    setSortBy(sortBy);
    setSearch(search);
  }

  async function handleSync() {
    if (!deck) {
      return;
    }

    setSyncing(true);
    try {
      await ArchidektService.syncDeckDetails(deck);
      navigate(0);
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="p-5 w-full" style={{ maxWidth: "1750px" }}>
      <Flex align="center" justify="between">
        <CardListFilters onChange={handleCardListFiltersChange} />
        <Flex gap="2">
          <Button
            variant="soft"
            color="gray"
            onClick={handleSync}
            disabled={!deck || syncing}
            loading={syncing}
          >
            <UpdateIcon width="18" height="18" />
            Sync
          </Button>
          <IconButton
            variant="soft"
            disabled={!deck}
            onClick={() =>
              window.open(
                ArchidektService.getDeckUrl(deck?.externalId ?? ""),
                "_blank"
              )
            }
          >
            <ExternalLinkIcon width="18" height="18" />
          </IconButton>
        </Flex>
      </Flex>
      {deck ? (
        <CardList
          groupBy={groupBy}
          sortBy={sortBy}
          search={search}
          cards={deck.cards ?? []}
          categories={deck.categories ?? []}
          columnCount={5}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
}
