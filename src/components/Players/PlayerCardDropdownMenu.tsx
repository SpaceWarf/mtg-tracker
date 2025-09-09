import {
  faEllipsisV,
  faMagnifyingGlass,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import { ArchidektService } from "../../services/Archidekt";
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
  const navigate = useNavigate();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray">
            <FontAwesomeIcon icon={faEllipsisV} />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="mb-1"
            onClick={() => navigate(`/?players=${player.id}`)}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Search Games
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
