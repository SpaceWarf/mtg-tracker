import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DeckService } from "../../services/Deck";
import { DeckWithStats } from "../../state/Deck";
import { DeckCard2 } from "./DeckCard2";

type OwnProps = {
  open: boolean;
  deck: DeckWithStats;
  onClose: () => void;
};

export function DeckDeleteModal({ open, deck, onClose }: OwnProps) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<boolean>(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  async function handleDelete() {
    setDeleting(true);
    await DeckService.delete(deck.id);
    setDeleting(false);
    navigate(0);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Delete {deck.name}</Dialog.Title>
        <Text>
          Are you sure you want to delete this deck? This will remove it from
          all associated games and <b>cannot be undone</b>.
        </Text>
        <Flex mt="5" mb="7" justify="center">
          <DeckCard2 deck={deck} />
        </Flex>
        <Flex gap="3" justify="between">
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <FontAwesomeIcon icon={faXmark} />
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
            <FontAwesomeIcon icon={faTrash} />
            Delete Forever
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
