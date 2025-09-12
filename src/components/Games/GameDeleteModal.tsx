import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { GameService } from "../../services/Game";
import { DbGame } from "../../state/Game";
import { Icon } from "../Common/Icon";

type OwnProps = {
  open: boolean;
  game: DbGame;
  onClose: () => void;
};

export function GameDeleteModal({ open, game, onClose }: OwnProps) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<boolean>(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  async function handleDelete() {
    setDeleting(true);
    await GameService.delete(game.id);
    setDeleting(false);
    navigate(0);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Delete game</Dialog.Title>
        <Text>
          Are you sure you want to delete this game? This{" "}
          <b>cannot be undone</b>.
        </Text>
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
