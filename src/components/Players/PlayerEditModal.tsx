import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Heading, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PlayerService } from "../../services/Player";
import { DbPlayer, PlayerWithStats } from "../../state/Player";
import { getDbPlayerFromPlayerWithStats } from "../../utils/Player";

type OwnProps = {
  open: boolean;
  player: PlayerWithStats;
  onClose: () => void;
};

export function PlayerEditModal({ open, player, onClose }: OwnProps) {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(player.name);
  const [externalId, setExternalId] = useState<string>(player.externalId);

  async function handleSave() {
    const update: DbPlayer = {
      ...getDbPlayerFromPlayerWithStats(player),
      name,
      externalId,
    };
    await PlayerService.update(player.id, update);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName(player.name);
      setExternalId(player.externalId);
      onClose();
    }
  }

  function canSave(): boolean {
    return !!name;
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
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
            External ID
          </Heading>
          <TextField.Root
            className="input-field"
            placeholder="External ID..."
            value={externalId}
            onChange={({ target }) => setExternalId(target.value)}
          ></TextField.Root>
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <Cross2Icon />
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canSave()} onClick={handleSave}>
            <Button className="h-10">
              <CheckIcon />
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
