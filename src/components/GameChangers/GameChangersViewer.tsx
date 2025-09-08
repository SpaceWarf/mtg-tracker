import {
  faCodeCommit,
  faGem,
  faRotate,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, IconButton, Spinner, Tooltip } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "../../assets/styles/DataCard.scss";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGameChangers } from "../../hooks/useGameChangers";
import { useMousePosition } from "../../hooks/useMousePosition";
import { ArchidektService } from "../../services/Archidekt";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { CardList } from "../Cards/CardList";
import { CardListFilters } from "../Cards/CardListFilters";
import { DataCard } from "../Common/DataCard";
import { DeckVersionViewer } from "../Decks/DeckVersionViewer";

export function GameChangersViewer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { dbDecks } = useDecks();
  const mousePosition = useMousePosition();
  const { gameChangers } = useGameChangers();

  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [showVersionGraph, setShowVersionGraph] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    searchParams.get("version") ?? "latest"
  );

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

  function handleArchidekt() {
    window.open(ArchidektService.getDeckUrl(deck?.externalId ?? ""), "_blank");
  }

  function handleVersionChange(value: string) {
    setSelectedVersionId(value);
    searchParams.set("version", value);
    setSearchParams(searchParams);
  }

  if (!deck) {
    return <Spinner size="3" mt="5" />;
  }

  return (
    <div className="p-5 w-full max-w-[1750px]">
      <Flex direction="column" gap="5">
        <DataCard
          title="Gamer Changers"
          icon={<FontAwesomeIcon icon={faGem} />}
          direction="row"
          align="between"
        >
          <Flex gap="2">
            {!!user && (
              <Tooltip content="Sync Deck">
                <IconButton
                  variant="soft"
                  color="gray"
                  size="3"
                  disabled={syncing}
                  loading={syncing}
                  onClick={handleSync}
                >
                  <FontAwesomeIcon icon={faRotate} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip content="Open on Archidekt">
              <IconButton
                variant="soft"
                color="gray"
                size="3"
                disabled={syncing}
                onClick={handleArchidekt}
              >
                <img src="/img/logos/archidekt.webp" width="18" height="18" />
              </IconButton>
            </Tooltip>
          </Flex>
        </DataCard>
        {deck.versions && deck.versions.length > 0 && (
          <DataCard
            title="Versions"
            icon={<FontAwesomeIcon icon={faCodeCommit} />}
            collapsable
            defaultCollapsed
          >
            <DeckVersionViewer
              deck={deck}
              sortCardsBy={sortBy}
              mousePosition={mousePosition}
              gameChangers={gameChangers ?? []}
              selectedVersionId={selectedVersionId}
              onClickVersion={handleVersionChange}
            />
          </DataCard>
        )}
        {deck.cards && deck.cards.length > 0 && (
          <DataCard
            title="Decklist"
            icon={<FontAwesomeIcon icon={faTableList} />}
          >
            <CardListFilters
              hasVersions={(deck.versions?.length ?? 0) > 0}
              onChange={handleCardListFiltersChange}
            />
            <CardList
              groupBy={groupBy}
              sortBy={sortBy}
              search={search}
              showVersionGraph={showVersionGraph}
              deck={deck}
              columnCount={5}
              selectedVersionId={selectedVersionId}
              onClickVersion={handleVersionChange}
            />
          </DataCard>
        )}
      </Flex>
    </div>
  );
}
