import { InfoCircledIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Callout,
  Dialog,
  Flex,
  Heading,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckService } from "../../services/Deck";
import { DbDeck } from "../../state/Deck";
import { getDeckCommandersString } from "../../utils/Deck";
import { getPlayerByExternalId } from "../../utils/Player";
import { PlayerSelect } from "../Select/PlayerSelect";

type OwnProps = {
  deck: DbDeck;
};

export function DeckEditModal({ deck }: OwnProps) {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const [name, setName] = useState<string>(deck.name);
  const [commander, setCommander] = useState<string>(deck.commander);
  const [externalId, setExternalId] = useState<string>(deck.externalId ?? "");
  const [builder, setBuilder] = useState<string>(deck.builder ?? "");
  const [autofilling, setAutofilling] = useState<boolean>(false);
  const [autofillError, setAutofillError] = useState<string>("");

  async function handleSave() {
    const update: DbDeck = {
      ...cloneDeep(deck),
      name,
      commander,
      externalId,
      builder: builder ?? "",
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
      setBuilder(deck.builder ?? "");
      setExternalId(deck.externalId ?? "");
    }
  }

  function canSave(): boolean {
    return !!name && !!commander && !autofilling;
  }
  async function handleAutofill() {
    setAutofilling(true);
    try {
      const deckDetails = await ArchidektService.getDeckDetailsById(externalId);
      setName(deckDetails.title);
      setCommander(getDeckCommandersString(deckDetails.commanders));
      const builder = getPlayerByExternalId(deckDetails.owner, dbPlayers ?? []);
      setBuilder(builder?.id ?? "");
      setAutofillError("");
    } catch (error) {
      console.error(error);
      setAutofillError("Invalid External ID.");
    } finally {
      setAutofilling(false);
    }
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

        <div className="mb-3">
          <Heading className="mb-1" size="3">
            External ID
          </Heading>
          <TextField.Root
            className="input-field"
            placeholder="External ID..."
            value={externalId}
            disabled={autofilling}
            onChange={({ target }) => setExternalId(target.value)}
          ></TextField.Root>
          {autofillError && (
            <Callout.Root color="red" className="mt-2">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{autofillError}</Callout.Text>
            </Callout.Root>
          )}
        </div>

        <Flex className="mb-5" justify="center">
          <Button
            className="h-10"
            onClick={handleAutofill}
            disabled={!externalId || autofilling}
          >
            <Pencil1Icon width="18" height="18" />
            Autofill Details
          </Button>
        </Flex>

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
            Built By
          </Heading>
          <PlayerSelect
            value={builder as string}
            onChange={setBuilder}
            isMulti={false}
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
