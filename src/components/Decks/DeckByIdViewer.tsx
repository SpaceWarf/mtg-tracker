import {
  faBomb,
  faCodeCommit,
  faDice,
  faForward,
  faFrown,
  faGem,
  faLayerGroup,
  faLeftLong,
  faPen,
  faRotate,
  faSmile,
  faTableList,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Flex,
  Grid,
  IconButton,
  SegmentedControl,
  Spinner,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import "../../assets/styles/DataCard.scss";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGameChangers } from "../../hooks/useGameChangers";
import { useGames } from "../../hooks/useGames";
import { useMousePosition } from "../../hooks/useMousePosition";
import { ArchidektService } from "../../services/Archidekt";
import { EdhRecService } from "../../services/EdhRec";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { DeckByIdViewType } from "../../state/DeckByIdViewType";
import {
  EXTRA_TURN_LIMIT,
  GAME_CHANGER_LIMIT,
  MASS_LAND_DENIAL_LIMIT,
  TUTOR_LIMIT,
} from "../../utils/Bracket";
import {
  getDeckBadMatchups,
  getDeckGoodMatchups,
  populateDeck,
} from "../../utils/Deck";
import { CardList } from "../Cards/CardList";
import { CardListFilters } from "../Cards/CardListFilters";
import { CommanderPreview } from "../Common/CommanderPreview";
import { DataCard } from "../Common/DataCard";
import { DeckCardPreviewSection } from "./DeckCardPreviewSection";
import { DeckCombosSection } from "./DeckCombosSection";
import { DeckDeleteModal } from "./DeckDeleteModal";
import { DeckEditModal } from "./DeckEditModal";
import { DeckShowcase } from "./DeckShowcase";
import { DeckStatsSection } from "./DeckStatsSection";
import { DeckVersionManagerModal } from "./DeckVersionManagerModal";
import { DeckVersionManagerSection } from "./DeckVersionManagerSection";
import { DeckVersionViewer } from "./DeckVersionViewer";

export function DeckByIdViewer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();
  const { gameChangers } = useGameChangers();
  const mousePosition = useMousePosition();

  const [searchParams, setSearchParams] = useSearchParams();
  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [showVersionGraph, setShowVersionGraph] = useState<boolean>(false);
  const [viewType, setViewType] = useState<DeckByIdViewType>(
    (searchParams.get("view") as DeckByIdViewType) || DeckByIdViewType.STATS
  );
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [versionManagerOpen, setVersionManagerOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    searchParams.get("version") ?? "latest"
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

  const cardPreviewRowCount = useMemo(() => {
    let count = 0;

    if (!populatedDeck) {
      return 0;
    }

    if (populatedDeck.gameChangers.length > 0) {
      count++;
    }

    if (populatedDeck.tutors.length > 0) {
      count++;
    }

    if (populatedDeck.extraTurns.length > 0) {
      count++;
    }

    if (populatedDeck.massLandDenials.length > 0) {
      count++;
    }

    return Math.ceil(count / 2);
  }, [populatedDeck]);

  const goodMatchups = useMemo(() => {
    if (!populatedDeck) {
      return [];
    }
    return getDeckGoodMatchups(populatedDeck);
  }, [populatedDeck]);

  const badMatchups = useMemo(() => {
    if (!populatedDeck) {
      return [];
    }
    return getDeckBadMatchups(populatedDeck);
  }, [populatedDeck]);

  useEffect(() => {
    if (!loading && id && !deck) {
      navigate("/decks");
    }
  }, [deck, id, loading, navigate]);

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

  function handleSearchGames() {
    navigate(`/?decks=${deck?.id}`);
  }

  function handleArchidekt() {
    window.open(ArchidektService.getDeckUrl(deck?.externalId ?? ""), "_blank");
  }

  function handleEdhRec() {
    window.open(EdhRecService.getDeckUrl(deck?.commander ?? ""), "_blank");
  }

  function handleEdit() {
    setEditModalOpen(true);
  }

  async function handleSync() {
    if (!populatedDeck) {
      return;
    }

    setSyncing(true);
    try {
      await ArchidektService.syncDeckDetails(populatedDeck);
      navigate(0);
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  }

  function handleDelete() {
    setDeleteModalOpen(true);
  }

  function handleViewTypeChange(value: DeckByIdViewType) {
    setViewType(value);
    searchParams.set("view", value);
    setSearchParams(searchParams);
  }

  function handleVersionChange(value: string) {
    setSelectedVersionId(value);
    searchParams.set("version", value);
    setSearchParams(searchParams);
  }

  if (loading || !populatedDeck) {
    return <Spinner mt="5" size="3" />;
  }

  return (
    <>
      {editModalOpen && (
        <DeckEditModal
          open={editModalOpen}
          deck={populatedDeck}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {versionManagerOpen && (
        <DeckVersionManagerModal
          open={versionManagerOpen}
          deck={populatedDeck}
          onClose={() => setVersionManagerOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <DeckDeleteModal
          open={deleteModalOpen}
          deck={populatedDeck}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}

      <div className="deck-by-id-viewer p-5 w-full max-w-[1750px]">
        <Flex direction="column" gap="5">
          <DataCard direction="row" align="between">
            <Flex gap="3" width="250px">
              <Link to="/decks">
                <Button variant="soft" color="gray" size="3" disabled={syncing}>
                  <FontAwesomeIcon icon={faLeftLong} />
                  Back
                </Button>
              </Link>
            </Flex>

            {populatedDeck.externalId && (
              <SegmentedControl.Root
                defaultValue={DeckByIdViewType.STATS}
                size="3"
                value={viewType}
                disabled={syncing}
                onValueChange={handleViewTypeChange}
              >
                <SegmentedControl.Item value={DeckByIdViewType.STATS}>
                  Stats
                </SegmentedControl.Item>
                <SegmentedControl.Item value={DeckByIdViewType.DECKLIST}>
                  Decklist
                </SegmentedControl.Item>
                {!!user &&
                  populatedDeck.versions &&
                  populatedDeck.versions.length > 0 && (
                    <SegmentedControl.Item
                      value={DeckByIdViewType.VERSION_MANAGER}
                    >
                      Version Manager
                    </SegmentedControl.Item>
                  )}
              </SegmentedControl.Root>
            )}

            <Flex gap="2" justify="end" width="250px">
              <Tooltip content="View All Games">
                <IconButton
                  variant="soft"
                  color="gray"
                  size="3"
                  disabled={syncing}
                  onClick={handleSearchGames}
                >
                  <FontAwesomeIcon icon={faDice} />
                </IconButton>
              </Tooltip>
              {populatedDeck.externalId && (
                <>
                  <Tooltip content="Open on Archidekt">
                    <IconButton
                      variant="soft"
                      color="gray"
                      size="3"
                      disabled={syncing}
                      onClick={handleArchidekt}
                    >
                      <img
                        src="/img/logos/archidekt.webp"
                        width="18"
                        height="18"
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Open on EDHREC">
                    <IconButton
                      variant="soft"
                      color="gray"
                      size="3"
                      disabled={syncing}
                      onClick={handleEdhRec}
                    >
                      <img
                        src="/img/logos/edhrec.webp"
                        width="18"
                        height="18"
                      />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {!!user && (
                <Tooltip content="Edit Deck">
                  <IconButton
                    variant="soft"
                    color="gray"
                    size="3"
                    disabled={syncing}
                    onClick={handleEdit}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </IconButton>
                </Tooltip>
              )}
              {!!user && populatedDeck.externalId && (
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
              {!!user && (
                <Tooltip content="Delete Deck">
                  <IconButton
                    variant="soft"
                    color="red"
                    size="3"
                    disabled={syncing}
                    onClick={handleDelete}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Tooltip>
              )}
            </Flex>
          </DataCard>

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
                      <DataCard
                        title="Versions"
                        icon={<FontAwesomeIcon icon={faCodeCommit} />}
                        collapsable
                        defaultCollapsed
                      >
                        <DeckVersionViewer
                          deck={populatedDeck}
                          sortCardsBy={sortBy}
                          mousePosition={mousePosition}
                          gameChangers={gameChangers ?? []}
                          selectedVersionId={selectedVersionId}
                          onClickVersion={handleVersionChange}
                        />
                      </DataCard>
                    )}
                  {populatedDeck.cards && populatedDeck.cards.length > 0 && (
                    <DataCard
                      title="Decklist"
                      icon={<FontAwesomeIcon icon={faTableList} />}
                    >
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
                        selectedVersionId={selectedVersionId}
                        onClickVersion={handleVersionChange}
                      />
                    </DataCard>
                  )}
                </>
              )}
              {viewType === DeckByIdViewType.STATS && (
                <>
                  <DeckStatsSection deck={populatedDeck} />
                  <Grid gap="5" columns="2" rows={`${cardPreviewRowCount}`}>
                    {populatedDeck.gameChangers.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Game Changers (${populatedDeck.gameChangers.length})`}
                        icon={<FontAwesomeIcon icon={faGem} />}
                        cards={populatedDeck.gameChangers}
                        error={
                          populatedDeck.gameChangers.length > GAME_CHANGER_LIMIT
                        }
                      />
                    )}
                    {populatedDeck.tutors.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Tutors (${populatedDeck.tutors.length})`}
                        icon={<FontAwesomeIcon icon={faLayerGroup} />}
                        cards={populatedDeck.tutors}
                        error={populatedDeck.tutors.length > TUTOR_LIMIT}
                      />
                    )}
                    {populatedDeck.extraTurns.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Extra Turns (${populatedDeck.extraTurns.length})`}
                        icon={<FontAwesomeIcon icon={faForward} />}
                        cards={populatedDeck.extraTurns}
                        error={
                          populatedDeck.extraTurns.length > EXTRA_TURN_LIMIT
                        }
                      />
                    )}
                    {populatedDeck.massLandDenials.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Mass Land Denials (${populatedDeck.massLandDenials.length})`}
                        icon={<FontAwesomeIcon icon={faBomb} />}
                        cards={populatedDeck.massLandDenials}
                        error={
                          populatedDeck.massLandDenials.length >
                          MASS_LAND_DENIAL_LIMIT
                        }
                      />
                    )}
                  </Grid>
                  {populatedDeck.combos.length > 0 && (
                    <DeckCombosSection deck={populatedDeck} />
                  )}
                  {goodMatchups.length > 0 && (
                    <DataCard
                      title="Good Matchups"
                      icon={<FontAwesomeIcon icon={faSmile} />}
                    >
                      <Flex gap="7" justify="center">
                        {goodMatchups.map((matchup) => (
                          <CommanderPreview
                            key={matchup.deck}
                            deck={matchup.deck}
                            won={matchup.won}
                            lost={matchup.lost}
                            good
                          />
                        ))}
                      </Flex>
                    </DataCard>
                  )}
                  {badMatchups.length > 0 && (
                    <DataCard
                      title="Bad Matchups"
                      icon={<FontAwesomeIcon icon={faFrown} />}
                    >
                      <Flex gap="7" justify="center">
                        {badMatchups.map((matchup) => (
                          <CommanderPreview
                            key={matchup.deck}
                            deck={matchup.deck}
                            won={matchup.won}
                            lost={matchup.lost}
                          />
                        ))}
                      </Flex>
                    </DataCard>
                  )}
                </>
              )}
              {!!user &&
                populatedDeck.versions &&
                populatedDeck.versions.length > 0 &&
                viewType === DeckByIdViewType.VERSION_MANAGER && (
                  <DeckVersionManagerSection deck={populatedDeck} />
                )}
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
}
