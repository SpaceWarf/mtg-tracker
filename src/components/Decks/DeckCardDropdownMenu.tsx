import {
  faCodeCommit,
  faDice,
  faEllipsisV,
  faEye,
  faPen,
  faRotate,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { FiltersContext } from "../../contexts/FiltersContext";
import { ArchidektService } from "../../services/Archidekt";
import { EdhRecService } from "../../services/EdhRec";
import { DeckWithStats } from "../../state/Deck";
import { GameSortFctKey } from "../../state/GameSortFctKey";

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
  const {
    setGameSortBy,
    setGameIncludedPlayers,
    setGameExcludedPlayers,
    setGameIncludedDecks,
    setGameExcludedDecks,
  } = useContext(FiltersContext);

  const navigate = useNavigate();

  function handleSearchGames() {
    setGameIncludedPlayers([]);
    setGameExcludedPlayers([]);
    setGameIncludedDecks([deck.id]);
    setGameExcludedDecks([]);
    setGameSortBy(GameSortFctKey.DATE_DESC);
    navigate(`/`);
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger disabled={syncing}>
          <IconButton variant="soft" color="gray">
            <FontAwesomeIcon icon={faEllipsisV} />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="mb-1"
            onClick={() => {
              navigate(`/decks/${deck.id}`);
            }}
          >
            <FontAwesomeIcon icon={faEye} />
            Open
          </DropdownMenu.Item>
          <DropdownMenu.Item className="mb-1" onClick={handleSearchGames}>
            <FontAwesomeIcon icon={faDice} />
            View All Games
          </DropdownMenu.Item>
          {deck.externalId && (
            <DropdownMenu.Item
              className="mb-1"
              onClick={() => {
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
              onClick={() => {
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
            <DropdownMenu.Item className="mb-1" onClick={onEdit}>
              <FontAwesomeIcon icon={faPen} />
              Edit
            </DropdownMenu.Item>
          )}
          {editable && (
            <DropdownMenu.Item className="mb-1" onClick={onSync}>
              <FontAwesomeIcon icon={faRotate} />
              Sync
            </DropdownMenu.Item>
          )}
          {editable && deck.versions && deck.versions.length > 0 && (
            <DropdownMenu.Item className="mb-1" onClick={onVersionManager}>
              <FontAwesomeIcon icon={faCodeCommit} />
              Manage versions
            </DropdownMenu.Item>
          )}
          {editable && <DropdownMenu.Separator />}
          {editable && (
            <DropdownMenu.Item color="red" onClick={onDelete}>
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
