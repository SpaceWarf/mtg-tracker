import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Heading, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import ReactSelect, { SingleValue } from "react-select";
import { usePlayers } from "../../hooks/usePlayers";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import { DeckService } from "../../services/Deck";
import { Deck } from "../../state/Deck";
import { SelectOption } from "../../state/SelectOption";

export function DeckCreateModal() {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const playerSelectOptions = useSelectOptions(dbPlayers ?? [], "id", "name");
  const [name, setName] = useState<string>("");
  const [commander, setCommander] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [builder, setBuilder] = useState<SingleValue<SelectOption>>();

  async function handleCreate() {
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
        <Button className="h-10 mt-6">
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

        <div className="mb-5">
          <Heading className="mb-1" size="3">
            Built By
          </Heading>
          <ReactSelect
            className="react-select-container min-w-60"
            classNamePrefix="react-select"
            name="player"
            options={playerSelectOptions}
            value={builder}
            onChange={setBuilder}
            menuPlacement="top"
          />
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canSave()} onClick={handleCreate}>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
