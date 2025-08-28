import {
  DotsVerticalIcon,
  ExternalLinkIcon,
  Pencil1Icon,
  SliderIcon,
  TrashIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  DropdownMenu,
  Flex,
  IconButton,
  Spinner,
  Tabs,
  Text,
} from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArchidektService } from "../../services/Archidekt";
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

export function DeckCard({
  deck,
  editable,
  highlightedKey,
  highlightedDirection,
}: OwnProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<DeckCardView>(DeckCardView.DECK_STATS);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [versionManagerOpen, setVersionManagerOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

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
      <Card size="3">
        <Flex className="mb-3" justify="between">
          <DeckHeader deck={deck} size="small" />
          {(editable || deck.externalId) && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger disabled={syncing}>
                <IconButton variant="soft">
                  <DotsVerticalIcon width="18" height="18" />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
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
                    <ExternalLinkIcon width="18" height="18" />
                    Open in Archidekt
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
                    <SliderIcon width="18" height="18" />
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
          )}
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
              {deck.externalId && <DeckCardListModal deck={deck} />}

              {deck.updatedAt && (
                <Text size="1" color="gray">
                  <i>Last synced on {getDateTimeString(deck.updatedAt)}</i>
                </Text>
              )}
            </Flex>
          </>
        )}
      </Card>
    </>
  );
}
