import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import "../../assets/styles/PlayerHeader.scss";
import { PlayerWithStats } from "../../state/Player";
import { PlayerCardDropdownMenu } from "./PlayerCardDropdownMenu";
import { PlayerDeleteModal } from "./PlayerDeleteModal";
import { PlayerEditModal } from "./PlayerEditModal";

type OwnProps = {
  player: PlayerWithStats;
  editable?: boolean;
  showActions?: boolean;
};

export function PlayerHeader2({ player, editable, showActions }: OwnProps) {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      {editModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <PlayerEditModal
            open={editModalOpen}
            player={player}
            onClose={() => setEditModalOpen(false)}
          />
        </div>
      )}
      {deleteModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <PlayerDeleteModal
            open={deleteModalOpen}
            player={player}
            onClose={() => setDeleteModalOpen(false)}
          />
        </div>
      )}

      <Flex className="player-header" justify="between">
        <p className="player-name">{player.name}</p>
        <Flex className="actions">
          {showActions && (
            <PlayerCardDropdownMenu
              player={player}
              editable={editable}
              onEdit={() => setEditModalOpen(true)}
              onDelete={() => setDeleteModalOpen(true)}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
}
