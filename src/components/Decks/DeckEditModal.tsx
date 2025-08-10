import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Select,
  TextField,
} from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { usePlayers } from "../../hooks/usePlayers";
import { DeckService } from "../../services/Deck";
import { DbDeck } from "../../state/Deck";

type OwnProps = {
  deck: DbDeck;
};

const EMPTY_OPTION = "empty-option";

export function DeckEditModal({ deck }: OwnProps) {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const [name, setName] = useState<string>(deck.name);
  const [commander, setCommander] = useState<string>(deck.commander);
  const [url, setUrl] = useState<string>(deck.url ?? "");
  const [builder, setBuilder] = useState<string>(deck.builder ?? EMPTY_OPTION);

  async function handleSave() {
    const update: DbDeck = {
      ...cloneDeep(deck),
      name,
      commander,
      url,
      builder: builder === EMPTY_OPTION ? "" : builder,
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
          <Select.Root
            value={builder}
            onValueChange={(value) => setBuilder(value)}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Item value={EMPTY_OPTION}>-</Select.Item>
                {cloneDeep(dbPlayers)
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((player) => (
                    <Select.Item key={player.id} value={player.id}>
                      {player.name}
                    </Select.Item>
                  ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
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
