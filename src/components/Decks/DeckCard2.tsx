import { faCrown, faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Tooltip } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "../../assets/styles/DeckCard.scss";
import { ArchidektService } from "../../services/Archidekt";
import { DeckWithStats } from "../../state/Deck";
import { PieChart } from "../Common/PieChart";
import { DeckCardDropdownMenu } from "./DeckCardDropdownMenu";
import { DeckCardListModal } from "./DeckCardListModal";
import { DeckColourIdentity } from "./DeckColourIdentity";
import { DeckDeleteModal } from "./DeckDeleteModal";
import { DeckEditModal } from "./DeckEditModal";
import { DeckTags } from "./DeckTags";
import { DeckVersionManagerModal } from "./DeckVersionManagerModal";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function DeckCard2({ deck, editable }: OwnProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [versionManagerOpen, setVersionManagerOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [decklistModalOpen, setDecklistModalOpen] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  const winPercent = useMemo(() => {
    return Math.round(deck.winRate * 100);
  }, [deck.winRate]);

  const winPercentColour = useMemo(() => {
    if (winPercent < 25) {
      return "red";
    }

    if (winPercent < 50) {
      return "orange";
    }

    return "green";
  }, [winPercent]);

  useEffect(() => {
    const decklist = searchParams.get("decklist");
    if (decklist === deck.id) {
      setDecklistModalOpen(true);
    }
  }, [deck.id, searchParams]);

  async function handleSync() {
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

  function handleCloseDecklistModal() {
    setDecklistModalOpen(false);
    searchParams.delete("decklist");
    searchParams.delete("version");
    setSearchParams(searchParams);
  }

  return (
    <>
      {editModalOpen && (
        <DeckEditModal
          open={editModalOpen}
          deck={deck}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {versionManagerOpen && (
        <DeckVersionManagerModal
          open={versionManagerOpen}
          deck={deck}
          onClose={() => setVersionManagerOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <DeckDeleteModal
          open={deleteModalOpen}
          deck={deck}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
      {decklistModalOpen && (
        <DeckCardListModal
          open={decklistModalOpen}
          deck={deck}
          onClose={handleCloseDecklistModal}
        />
      )}

      <div
        className="deck-card mt-2"
        style={
          {
            ["--url" as string]: `url(${deck.featured})`,
          } as React.CSSProperties
        }
      >
        <Flex className="h-full" direction="column" justify="between">
          <Flex className="content-container" gap="3">
            <Flex direction="column" flexBasis="65%" flexGrow="1">
              <Flex direction="column" gap="1">
                <Flex align="center" gap="1">
                  <p className="deck-name">{deck.name}</p>
                  <p className="deck-version">
                    v{(deck.versions?.length ?? 0) + 1}
                  </p>
                </Flex>
                <Flex gap="1">
                  <p className="deck-commander">{deck.commander}</p>
                  {deck.externalId && <DeckColourIdentity deck={deck} />}
                </Flex>
              </Flex>
              <Flex mt="4" gap="4">
                <Tooltip content="Games played">
                  <Flex className="games-played-container" gap="2">
                    <FontAwesomeIcon size="xl" icon={faDice} />
                    <p>{deck.gamesPlayed}</p>
                  </Flex>
                </Tooltip>
                <Tooltip content="Games won">
                  <Flex className="games-won-container" gap="2">
                    <FontAwesomeIcon size="xl" icon={faCrown} />
                    <p>{deck.winCount}</p>
                  </Flex>
                </Tooltip>
              </Flex>
            </Flex>
            <Flex direction="column" flexGrow="1" align="end" gap="3">
              <DeckCardDropdownMenu
                deck={deck}
                editable={editable}
                syncing={syncing}
                onEdit={() => setEditModalOpen(true)}
                onSync={handleSync}
                onVersionManager={() => setVersionManagerOpen(true)}
                onDelete={() => setDeleteModalOpen(true)}
              />
              <div className="win-percent-container">
                <PieChart
                  value={winPercent}
                  colour={winPercentColour}
                  label="Win %"
                />
              </div>
            </Flex>
          </Flex>
          <Flex className="tags-container">
            <DeckTags deck={deck} />
          </Flex>
        </Flex>
      </div>
    </>
  );
}
