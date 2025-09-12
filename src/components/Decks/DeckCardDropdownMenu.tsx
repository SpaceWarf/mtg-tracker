import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { FiltersContext } from "../../contexts/FiltersContext";
import { ArchidektService } from "../../services/Archidekt";
import { EdhRecService } from "../../services/EdhRec";
import { DeckWithStats } from "../../state/Deck";
import { GameSortFctKey } from "../../state/GameSortFctKey";
import { Icon } from "../Common/Icon";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
  syncing?: boolean;
  onEdit: () => void;
  onSync: () => void;
  onDelete: () => void;
};

export function DeckCardDropdownMenu({
  deck,
  editable,
  syncing,
  onEdit,
  onSync,
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
            <Icon icon="ellipsis-vertical" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="mb-1"
            onClick={() => {
              navigate(`/decks/${deck.id}`);
            }}
          >
            <Icon icon="eye" />
            Open
          </DropdownMenu.Item>
          <DropdownMenu.Item className="mb-1" onClick={handleSearchGames}>
            <Icon icon="dice" />
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
              <Icon icon="pen" />
              Edit
            </DropdownMenu.Item>
          )}
          {editable && (
            <DropdownMenu.Item className="mb-1" onClick={onSync}>
              <Icon icon="rotate" />
              Sync
            </DropdownMenu.Item>
          )}
          {editable && <DropdownMenu.Separator />}
          {editable && (
            <DropdownMenu.Item color="red" onClick={onDelete}>
              <Icon icon="trash" />
              Delete
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
