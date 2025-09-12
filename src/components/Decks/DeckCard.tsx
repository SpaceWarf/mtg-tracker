import {
  CommitIcon,
  DotsVerticalIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Card,
  DropdownMenu,
  Flex,
  IconButton,
  Spinner,
  Tabs,
  Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArchidektService } from "../../services/Archidekt";
import { EdhRecService } from "../../services/EdhRec";
import { DeckWithStats } from "../../state/Deck";
import { DeckCardView } from "../../state/DeckCardView";
import { getDateTimeString } from "../../utils/Date";
import { DeckCardListModal } from "./DeckCardListModal";
import { DeckDeleteModal } from "./DeckDeleteModal";
import { DeckDetailsTable } from "./DeckDetailsTable";
import { DeckEditModal } from "./DeckEditModal";
import { DeckHeader } from "./DeckHeader";
import { DeckStatsTable } from "./DeckStatsTable";
import { DeckVersionManagerModal } from "./DeckVersionManagerModal";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

/**
 * Deprecated
 */
export function DeckCard({
  deck,
  editable,
  highlightedKey,
  highlightedDirection,
}: OwnProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<DeckCardView>(DeckCardView.DECK_STATS);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [versionManagerOpen, setVersionManagerOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [decklistModalOpen, setDecklistModalOpen] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

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

  function handleOpenDecklistModal() {
    setDecklistModalOpen(true);
    searchParams.set("decklist", deck.id);
    setSearchParams(searchParams);
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

      <Card size="3">
        <Flex className="mb-3" justify="between">
          <DeckHeader deck={deck} size="small" />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger disabled={syncing}>
              <IconButton variant="soft">
                <DotsVerticalIcon width="18" height="18" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                className="mb-1"
                onClick={() => navigate(`/?decks=${deck.id}`)}
              >
                <MagnifyingGlassIcon width="18" height="18" />
                Search Games
              </DropdownMenu.Item>
              {deck.externalId && (
                <DropdownMenu.Item
                  className="mb-1"
                  onClick={() =>
                    window.open(
                      ArchidektService.getDeckUrl(deck.externalId ?? ""),
                      "_blank"
                    )
                  }
                >
                  <img src="/img/logos/archidekt.webp" width="16" height="16" />
                  Open on Archidekt
                </DropdownMenu.Item>
              )}
              {deck.externalId && (
                <DropdownMenu.Item
                  className="mb-1"
                  onClick={() =>
                    window.open(
                      EdhRecService.getDeckUrl(deck.commander ?? ""),
                      "_blank"
                    )
                  }
                >
                  <img src="/img/logos/edhrec.webp" width="18" height="16" />
                  Open on EDHREC
                </DropdownMenu.Item>
              )}
              {editable && (
                <DropdownMenu.Item
                  className="mb-1"
                  onClick={() => setEditModalOpen(true)}
                >
                  <Pencil1Icon width="18" height="18" />
                  Edit
                </DropdownMenu.Item>
              )}
              {editable && (
                <DropdownMenu.Item className="mb-1" onClick={handleSync}>
                  <UpdateIcon width="18" height="18" />
                  Sync
                </DropdownMenu.Item>
              )}
              {editable && deck.versions && deck.versions.length > 0 && (
                <DropdownMenu.Item
                  className="mb-1"
                  onClick={() => setVersionManagerOpen(true)}
                >
                  <CommitIcon width="18" height="18" />
                  Manage versions
                </DropdownMenu.Item>
              )}
              {editable && <DropdownMenu.Separator />}
              {editable && (
                <DropdownMenu.Item
                  color="red"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <TrashIcon width="18" height="18" />
                  Delete
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>

        {syncing && (
          <Flex justify="center">
            <Spinner size="2" />
          </Flex>
        )}

        {!syncing && (
          <>
            <Tabs.Root className="mb-2" value={view}>
              <Tabs.List size="2">
                <Tabs.Trigger
                  value={DeckCardView.DECK_STATS}
                  onClick={() => setView(DeckCardView.DECK_STATS)}
                >
                  Stats
                </Tabs.Trigger>
                {deck.externalId && (
                  <Tabs.Trigger
                    value={DeckCardView.DECK_DETAILS}
                    onClick={() => setView(DeckCardView.DECK_DETAILS)}
                  >
                    Details
                  </Tabs.Trigger>
                )}
              </Tabs.List>
            </Tabs.Root>

            <div className="mb-2">
              {view === DeckCardView.DECK_STATS && (
                <DeckStatsTable
                  deck={deck}
                  highlightedKey={highlightedKey}
                  highlightedDirection={highlightedDirection}
                />
              )}

              {view === DeckCardView.DECK_DETAILS && (
                <DeckDetailsTable deck={deck} />
              )}
            </div>

            <Flex direction="column" gap="2">
              {deck.externalId && (
                <Button onClick={handleOpenDecklistModal}>
                  <ListBulletIcon width="18" height="18" />
                  Open Decklist
                </Button>
              )}

              {deck.updatedAt && (
                <Text size="1" color="gray">
                  <p>Last synced on {getDateTimeString(deck.updatedAt)}</p>
                </Text>
              )}
            </Flex>
          </>
        )}
      </Card>
    </>
  );
}
