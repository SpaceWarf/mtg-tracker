import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PlayerService } from "../../services/Player";
import { PlayerWithStats } from "../../state/Player";
import { Icon } from "../Common/Icon";
import { PlayerCard } from "./PlayerCard";

type OwnProps = {
  open: boolean;
  player: PlayerWithStats;
  onClose: () => void;
};

export function PlayerDeleteModal({ open, player, onClose }: OwnProps) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<boolean>(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  async function handleDelete() {
    setDeleting(true);
    await PlayerService.delete(player.id);
    setDeleting(false);
    navigate(0);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Delete {player.name}</Dialog.Title>
        <p>
          Are you sure you want to delete this player? This will remove them
          from all associated games and <b>cannot be undone</b>.
        </p>
        <Flex mt="5" mb="7" justify="center">
          <PlayerCard player={player} />
        </Flex>
        <Flex gap="3" justify="between" mt="4">
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <Icon icon="xmark" />
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            color="red"
            disabled={deleting}
            loading={deleting}
            onClick={handleDelete}
            className="h-10"
          >
            <Icon icon="trash" />
            Delete Forever
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
