import {
  faDice,
  faEllipsisV,
  faLayerGroup,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { FiltersContext } from "../../contexts/FiltersContext";
import { ArchidektService } from "../../services/Archidekt";
import { Bracket } from "../../state/Bracket";
import { DeckSortFctKey } from "../../state/DeckSortFctKey";
import { GameSortFctKey } from "../../state/GameSortFctKey";
import { IdentityLabel } from "../../state/IdentityLabel";
import { PlayerWithStats } from "../../state/Player";

type OwnProps = {
  player: PlayerWithStats;
  editable?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function PlayerCardDropdownMenu({
  player,
  editable,
  onEdit,
  onDelete,
}: OwnProps) {
  const {
    setGameSortBy,
    setGameIncludedPlayers,
    setGameExcludedPlayers,
    setGameIncludedDecks,
    setGameExcludedDecks,
    setDeckSearch,
    setDeckSortBy,
    setDeckBuilder,
    setDeckBracket,
    setDeckIdentity,
  } = useContext(FiltersContext);
  const navigate = useNavigate();

  function handleSearchGames() {
    setGameIncludedPlayers([player.id]);
    setGameExcludedPlayers([]);
    setGameIncludedDecks([]);
    setGameExcludedDecks([]);
    setGameSortBy(GameSortFctKey.DATE_DESC);
    navigate(`/`);
  }

  function handleSearchDecks() {
    setDeckSearch("");
    setDeckSortBy(DeckSortFctKey.NAME_ASC);
    setDeckBuilder(player.id);
    setDeckBracket("" as Bracket);
    setDeckIdentity("" as IdentityLabel);
    navigate(`/decks`);
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray">
            <FontAwesomeIcon icon={faEllipsisV} />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="mb-1" onClick={handleSearchGames}>
            <FontAwesomeIcon icon={faDice} />
            View All Games
          </DropdownMenu.Item>
          <DropdownMenu.Item className="mb-1" onClick={handleSearchDecks}>
            <FontAwesomeIcon icon={faLayerGroup} />
            View All Decks
          </DropdownMenu.Item>
          {player.externalId && (
            <DropdownMenu.Item
              className="mb-1"
              onClick={() =>
                window.open(
                  ArchidektService.getPlayerProfileUrl(player.externalId),
                  "_blank"
                )
              }
            >
              <img src="/img/logos/archidekt.webp" width="16" height="16" />
              Open on Archidekt
            </DropdownMenu.Item>
          )}
          {editable && (
            <DropdownMenu.Item className="mb-1" onClick={onEdit}>
              <FontAwesomeIcon icon={faPen} />
              Edit
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
