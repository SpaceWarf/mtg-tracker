import {
  CommitIcon,
  DotsVerticalIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import { ArchidektService } from "../../services/Archidekt";
import { EdhRecService } from "../../services/EdhRec";
import { DeckWithStats } from "../../state/Deck";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
  syncing?: boolean;
  onEdit: () => void;
  onSync: () => void;
  onVersionManager: () => void;
  onDelete: () => void;
};

export function DeckCardDropdownMenu({
  deck,
  editable,
  syncing,
  onEdit,
  onSync,
  onVersionManager,
  onDelete,
}: OwnProps) {
  const navigate = useNavigate();

  return (
    <div className="deck-card-dropdown-menu">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger disabled={syncing}>
          <IconButton variant="soft" color="gray">
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
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  ArchidektService.getDeckUrl(deck.externalId ?? ""),
                  "_blank"
                );
              }}
            >
              <img src="/img/logos/archidekt.webp" width="16" height="16" />
              Open on Archidekt
            </DropdownMenu.Item>
          )}
          {deck.externalId && (
            <DropdownMenu.Item
              className="mb-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  EdhRecService.getDeckUrl(deck.commander ?? ""),
                  "_blank"
                );
              }}
            >
              <img src="/img/logos/edhrec.webp" width="18" height="16" />
              Open on EDHREC
            </DropdownMenu.Item>
          )}
          {editable && (
            <DropdownMenu.Item
              className="mb-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil1Icon width="18" height="18" />
              Edit
            </DropdownMenu.Item>
          )}
          {editable && (
            <DropdownMenu.Item
              className="mb-1"
              onClick={(e) => {
                e.stopPropagation();
                onSync();
              }}
            >
              <UpdateIcon width="18" height="18" />
              Sync
            </DropdownMenu.Item>
          )}
          {editable && deck.versions && deck.versions.length > 0 && (
            <DropdownMenu.Item
              className="mb-1"
              onClick={(e) => {
                e.stopPropagation();
                onVersionManager();
              }}
            >
              <CommitIcon width="18" height="18" />
              Manage versions
            </DropdownMenu.Item>
          )}
          {editable && <DropdownMenu.Separator />}
          {editable && (
            <DropdownMenu.Item
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <TrashIcon width="18" height="18" />
              Delete
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
