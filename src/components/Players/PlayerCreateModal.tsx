import { Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PlayerService } from "../../services/Player";
import { Player } from "../../state/Player";
import { Icon } from "../Common/Icon";

export function PlayerCreateModal() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [externalId, setExternalId] = useState<string>("");

  async function handleCreate() {
    const player: Player = {
      name,
      externalId,
    };
    await PlayerService.create(player);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName("");
      setExternalId("");
    }
  }

  function canCreate(): boolean {
    return !!name;
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button className="h-10" variant="soft">
          <Icon icon="plus" />
          Create
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Create player</Dialog.Title>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Name</b>
          </p>
          <TextField.Root
            className="input-field"
            placeholder="Name..."
            value={name}
            onChange={({ target }) => setName(target.value)}
          ></TextField.Root>
        </div>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Archidekt Username</b>
          </p>
          <TextField.Root
            className="input-field"
            placeholder="Archidekt Username..."
            value={externalId}
            onChange={({ target }) => setExternalId(target.value)}
          ></TextField.Root>
        </div>

        <Flex gap="3" justify="between">
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <Icon icon="xmark" />
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canCreate()} onClick={handleCreate}>
            <Button className="h-10">
              <Icon icon="check" />
              Create
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
