import {
  faBomb,
  faCodeCommit,
  faGem,
  faLeftLong,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Flex, SegmentedControl, Spinner } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import "../../assets/styles/DeckByIdViewer.scss";
import { useDecks } from "../../hooks/useDecks";
import { useGameChangers } from "../../hooks/useGameChangers";
import { useGames } from "../../hooks/useGames";
import { useMousePosition } from "../../hooks/useMousePosition";
import { ArchidektService } from "../../services/Archidekt";
import { EdhRecService } from "../../services/EdhRec";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { DeckByIdViewType } from "../../state/DeckByIdViewType";
import { populateDeck } from "../../utils/Deck";
import { CardList } from "../Cards/CardList";
import { CardListFilters } from "../Cards/CardListFilters";
import { DeckCardPreviewSection } from "./DeckCardPreviewSection";
import { DeckCombosSection } from "./DeckCombosSection";
import { DeckShowcase } from "./DeckShowcase";
import { DeckStatsSection } from "./DeckStatsSection";
import { DeckVersionViewer } from "./DeckVersionViewer";

export function DeckByIdViewer() {
  const { id } = useParams();
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const { gameChangers } = useGameChangers();
  const mousePosition = useMousePosition();

  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [showVersionGraph, setShowVersionGraph] = useState<boolean>(false);
  const [viewType, setViewType] = useState<DeckByIdViewType>(
    DeckByIdViewType.STATS
  );

  const deck = useMemo(() => {
    return dbDecks?.find((deck) => deck.id === id);
  }, [dbDecks, id]);

  const populatedDeck = useMemo(() => {
    if (!deck || !dbGames || !gameChangers) {
      return undefined;
    }
    return populateDeck(deck, dbGames, gameChangers);
  }, [deck, dbGames, gameChangers]);

  const loading = useMemo(() => {
    return loadingDecks || loadingGames;
  }, [loadingDecks, loadingGames]);

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

  function handleArchidekt() {
    window.open(ArchidektService.getDeckUrl(deck?.externalId ?? ""), "_blank");
  }

  function handleEdhRec() {
    window.open(EdhRecService.getDeckUrl(deck?.commander ?? ""), "_blank");
  }

  if (loading || !populatedDeck) {
    return <Spinner mt="5" size="3" />;
  }

  return (
    <div className="deck-by-id-viewer p-5 w-full max-w-[1750px]">
      <Flex direction="column" gap="5">
        <Flex
          className="data-card actions-card"
          justify="between"
          align="center"
        >
          <Flex gap="3" width="250px">
            <Link to="/decks">
              <Button variant="soft" color="gray" size="3">
                <FontAwesomeIcon icon={faLeftLong} />
                Back
              </Button>
            </Link>
          </Flex>

          <SegmentedControl.Root
            defaultValue={DeckByIdViewType.STATS}
            size="3"
            value={viewType}
            onValueChange={(value) => setViewType(value as DeckByIdViewType)}
          >
            <SegmentedControl.Item value={DeckByIdViewType.STATS}>
              Stats
            </SegmentedControl.Item>
            <SegmentedControl.Item value={DeckByIdViewType.DECKLIST}>
              Decklist
            </SegmentedControl.Item>
          </SegmentedControl.Root>

          <Flex gap="3" align="end" width="250px">
            {deck?.externalId && (
              <>
                <Button
                  variant="soft"
                  color="gray"
                  size="3"
                  onClick={handleArchidekt}
                >
                  <img src="/img/logos/archidekt.webp" width="18" height="18" />
                  Archidekt
                </Button>
                <Button
                  variant="soft"
                  color="gray"
                  size="3"
                  onClick={handleEdhRec}
                >
                  <img src="/img/logos/edhrec.webp" width="18" height="18" />
                  EdhRec
                </Button>
              </>
            )}
          </Flex>
        </Flex>
        <Flex gap="5">
          <Flex flexBasis="425px" minWidth="425px">
            <div className="w-full">
              <DeckShowcase deck={populatedDeck} />
            </div>
          </Flex>
          <Flex direction="column" gap="5" flexGrow="1">
            {viewType === DeckByIdViewType.DECKLIST && (
              <>
                {populatedDeck.versions &&
                  populatedDeck.versions.length > 0 && (
                    <Flex className="data-card" direction="column">
                      <Flex className="title" align="center" gap="3" mb="5">
                        <FontAwesomeIcon icon={faCodeCommit} />
                        <p>Versions</p>
                      </Flex>
                      <DeckVersionViewer
                        deck={populatedDeck}
                        sortCardsBy={sortBy}
                        mousePosition={mousePosition}
                        gameChangers={gameChangers ?? []}
                      />
                    </Flex>
                  )}
                {populatedDeck.cards && populatedDeck.cards.length > 0 && (
                  <Flex className="data-card" direction="column">
                    <Flex className="title" align="center" gap="3" mb="5">
                      <FontAwesomeIcon icon={faTableList} />
                      <p>Decklist</p>
                    </Flex>
                    <CardListFilters
                      hasVersions={(populatedDeck.versions?.length ?? 0) > 0}
                      onChange={handleCardListFiltersChange}
                    />
                    <CardList
                      groupBy={groupBy}
                      sortBy={sortBy}
                      search={search}
                      showVersionGraph={showVersionGraph}
                      deck={populatedDeck}
                      columnCount={4}
                    />
                  </Flex>
                )}
              </>
            )}
            {viewType === DeckByIdViewType.STATS && (
              <>
                <DeckStatsSection deck={populatedDeck} />
                <Flex gap="5" wrap="wrap">
                  {populatedDeck.gameChangers.length > 0 && (
                    <DeckCardPreviewSection
                      title="Game Changers"
                      icon={<FontAwesomeIcon icon={faGem} />}
                      cards={populatedDeck.gameChangers}
                    />
                  )}
                  {populatedDeck.tutors.length > 0 && (
                    <DeckCardPreviewSection
                      title="Tutors"
                      icon={<FontAwesomeIcon icon={faGem} />}
                      cards={populatedDeck.tutors}
                    />
                  )}
                  {populatedDeck.extraTurns.length > 0 && (
                    <DeckCardPreviewSection
                      title="Extra Turns"
                      icon={<FontAwesomeIcon icon={faGem} />}
                      cards={populatedDeck.extraTurns}
                    />
                  )}
                  {populatedDeck.massLandDenials.length > 0 && (
                    <DeckCardPreviewSection
                      title="Mass Land Denial"
                      icon={<FontAwesomeIcon icon={faBomb} />}
                      cards={populatedDeck.massLandDenials}
                    />
                  )}
                </Flex>
                {populatedDeck.combos.length > 0 && (
                  <DeckCombosSection deck={populatedDeck} />
                )}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
