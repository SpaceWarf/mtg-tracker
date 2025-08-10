import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Heading, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PlayerService } from "../../services/Player";
import { Player } from "../../state/Player";

export function PlayerCreateModal() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string>("");

  async function handleCreate() {
    const player: Player = {
      name,
      profileUrl,
    };
    await PlayerService.create(player);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName("");
      setProfileUrl("");
    }
  }

  function canCreate(): boolean {
    return !!name;
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button className="h-10 mt-6">
          <PlusIcon width="18" height="18" />
          Create new player
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Create player</Dialog.Title>

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
            Profile URL
          </Heading>
          <TextField.Root
            className="input-field"
            placeholder="Profile URL..."
            value={profileUrl}
            onChange={({ target }) => setProfileUrl(target.value)}
          ></TextField.Root>
        </div>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canCreate()} onClick={handleCreate}>
            <Button>Create</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
