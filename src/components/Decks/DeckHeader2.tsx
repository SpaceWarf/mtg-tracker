import { Flex } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import "../../assets/styles/DeckHeader.scss";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckWithStats } from "../../state/Deck";
import { DeckCardDropdownMenu } from "./DeckCardDropdownMenu";
import { DeckColourIdentity } from "./DeckColourIdentity";
import { DeckDeleteModal } from "./DeckDeleteModal";
import { DeckEditModal } from "./DeckEditModal";
import { DeckVersionManagerModal } from "./DeckVersionManagerModal";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
  showActions?: boolean;
};

export function DeckHeader2({ deck, editable, showActions }: OwnProps) {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [versionManagerOpen, setVersionManagerOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  const builder = useMemo(() => {
    return (
      (dbPlayers || []).find((player) => player.id === deck.builder)?.name ??
      "-"
    );
  }, [deck.builder, dbPlayers]);

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
        <div onClick={(e) => e.stopPropagation()}>
          <DeckEditModal
            open={editModalOpen}
            deck={deck}
            onClose={() => setEditModalOpen(false)}
          />
        </div>
      )}
      {versionManagerOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <DeckVersionManagerModal
            open={versionManagerOpen}
            deck={deck}
            onClose={() => setVersionManagerOpen(false)}
          />
        </div>
      )}
      {deleteModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <DeckDeleteModal
            open={deleteModalOpen}
            deck={deck}
            onClose={() => setDeleteModalOpen(false)}
          />
        </div>
      )}

      <Flex className="deck-header" justify="between">
        <Flex className="name-container" direction="column" gap="1">
          <Flex align="center" gap="1" wrap="wrap">
            <p className="deck-name">{deck.name}</p>
            <p className="deck-version">v{(deck.versions?.length ?? 0) + 1}</p>
          </Flex>
          <Flex gap="1" wrap="wrap">
            <p className="deck-commander">{deck.commander}</p>
            {deck.externalId && <DeckColourIdentity deck={deck} />}
          </Flex>
          <p className="deck-builder">by {builder}</p>
        </Flex>
        <Flex className="actions">
          {showActions && (
            <DeckCardDropdownMenu
              deck={deck}
              editable={editable}
              syncing={syncing}
              onEdit={() => setEditModalOpen(true)}
              onSync={handleSync}
              onVersionManager={() => setVersionManagerOpen(true)}
              onDelete={() => setDeleteModalOpen(true)}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
}
