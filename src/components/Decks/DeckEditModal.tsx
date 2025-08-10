import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import ReactSelect, { SingleValue } from "react-select";
import { usePlayers } from "../../hooks/usePlayers";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import { DeckService } from "../../services/Deck";
import { DbDeck } from "../../state/Deck";
import { SelectOption } from "../../state/SelectOption";

type OwnProps = {
  deck: DbDeck;
};

export function DeckEditModal({ deck }: OwnProps) {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const playerSelectOptions = useSelectOptions(dbPlayers ?? [], "id", "name");
  const [name, setName] = useState<string>(deck.name);
  const [commander, setCommander] = useState<string>(deck.commander);
  const [url, setUrl] = useState<string>(deck.url ?? "");
  const [builder, setBuilder] = useState<SingleValue<SelectOption>>(
    playerSelectOptions.find((option) => option.value === deck.builder) || null
  );

  async function handleSave() {
    const update: DbDeck = {
      ...cloneDeep(deck),
      name,
      commander,
      url,
      builder: builder?.value ?? "",
    };
    await DeckService.update(deck.id, update);
    navigate(0);
  }

  async function handleDelete() {
    await DeckService.delete(deck.id);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName(deck.name);
      setCommander(deck.commander);
      setUrl(deck.url ?? "");
    }
  }

  function canSave(): boolean {
    return !!name && !!commander;
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
        <Dialog.Title>Edit deck</Dialog.Title>

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
