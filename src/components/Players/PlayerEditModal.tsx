import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PlayerService } from "../../services/Player";
import { DbPlayer, PlayerWithStats } from "../../state/Player";
import { getDbPlayerFromPlayerWithStats } from "../../utils/Player";

type OwnProps = {
  player: PlayerWithStats;
};

export function PlayerEditModal({ player }: OwnProps) {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(player.name);
  const [profileUrl, setProfileUrl] = useState<string>(player.profileUrl);

  async function handleSave() {
    const update: DbPlayer = {
      ...getDbPlayerFromPlayerWithStats(player),
      name,
      profileUrl,
    };
    await PlayerService.update(player.id, update);
    navigate(0);
  }

  async function handleDelete() {
    await PlayerService.delete(player.id);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName(player.name);
      setProfileUrl(player.profileUrl);
    }
  }

  function canSave(): boolean {
    return !!name;
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <IconButton variant="soft">
          <Pencil1Icon width="18" height="18" />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Edit player</Dialog.Title>

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

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close onClick={handleDelete}>
            <Button color="red">Delete</Button>
          </Dialog.Close>
          <Flex gap="3">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close disabled={!canSave()} onClick={handleSave}>
              <Button>Save</Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
