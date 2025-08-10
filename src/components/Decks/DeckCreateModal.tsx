import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Heading, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DeckService } from "../../services/Deck";
import { Deck } from "../../state/Deck";

export function DeckCreateModal() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [commander, setCommander] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  async function handleCReate() {
    const deck: Deck = {
      name,
      commander,
      url,
    };
    await DeckService.create(deck);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName("");
      setCommander("");
      setUrl("");
    }
  }

  function canSave(): boolean {
    return !!name && !!commander;
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button>
          <PlusIcon width="18" height="18" />
          Create new deck
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Create deck</Dialog.Title>

        <div className="mb-5">
          <Heading className="mb-1" size="3">
            Name
          </Heading>
          <TextField.Root
            className="input-field"
            placeholder="Name..."
            value={name}
            onChange={({ target }) => setName(target.value)}
          ></TextField.Root>
        </div>

        <div className="mb-5">
          <Heading className="mb-1" size="3">
            Commander
          </Heading>
          <TextField.Root
            className="input-field"
            placeholder="Commander..."
            value={commander}
            onChange={({ target }) => setCommander(target.value)}
          ></TextField.Root>
        </div>

        <div className="mb-5">
          <Heading className="mb-1" size="3">
            Url
          </Heading>
          <TextField.Root
            className="input-field"
            placeholder="Url..."
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          ></TextField.Root>
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canSave()} onClick={handleCReate}>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
