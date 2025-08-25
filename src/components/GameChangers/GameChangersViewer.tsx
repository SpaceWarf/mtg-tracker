import { ExternalLinkIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Spinner } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { ArchidektService } from "../../services/Archidekt";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { CardList } from "../Cards/CardList";
import { CardListFilters } from "../Cards/CardListFilters";

export function GameChangersViewer() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { dbDecks } = useDecks();
  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [showVersionGraph, setShowVersionGraph] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  const deck = useMemo(() => {
    return dbDecks?.find((deck) => deck.gameChangersDeck);
  }, [dbDecks]);

  function handleCardListFiltersChange(
    groupBy: CardGroupBy,
    sortBy: CardSortFctKey,
    search: string,
    showVersionGraph: boolean
  ) {
    setGroupBy(groupBy);
    setSortBy(sortBy);
    setSearch(search);
    setShowVersionGraph(showVersionGraph);
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
        <CardListFilters
          hasVersions={(deck?.versions?.length ?? 0) > 0}
          onChange={handleCardListFiltersChange}
        />
        <Flex gap="2">
          {auth.user && (
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
          )}
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
          showVersionGraph={showVersionGraph}
          deck={deck}
          forcedCategoryOrder={[
            "White",
            "Blue",
            "Black",
            "Red",
            "Green",
            "Colorless",
            "Multicolor",
            "Commanders",
          ]}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
}
