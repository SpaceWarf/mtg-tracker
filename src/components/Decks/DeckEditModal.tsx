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
import { cloneDeep, isEqual } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckService } from "../../services/Deck";
import { DbDeck } from "../../state/Deck";
import { DeckDetails } from "../../state/DeckDetails";
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
  const [deckDetails, setDeckDetails] = useState<DeckDetails>();
  const [autofilling, setAutofilling] = useState<boolean>(false);
  const [autofillError, setAutofillError] = useState<string>("");
  const [syncing, setSyncing] = useState<boolean>(false);

  async function handleSave() {
    const update: DbDeck = {
      ...cloneDeep(deck),
      name,
      commander,
      externalId,
      builder: builder ?? "",
      featured: deckDetails?.featured ?? "",
      price: deckDetails?.price ?? "",
      saltSum: deckDetails?.saltSum ?? "",
      size: deckDetails?.size ?? "",
      viewCount: deckDetails?.viewCount ?? "",
      format: deckDetails?.format ?? "",
      deckCreatedAt: deckDetails?.createdAt ?? "",
      deckUpdatedAt: deckDetails?.updatedAt ?? "",
      colourIdentity: deckDetails?.colourIdentity ?? [],
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
    return !!name && !!commander && !autofilling && !syncing;
  }

  async function handleAutofill() {
    setAutofilling(true);
    try {
      const deckDetails = await ArchidektService.getDeckDetailsById(externalId);
      setDeckDetails(deckDetails);
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

  async function handleSync() {
    setSyncing(true);
    try {
      const deckDetails = await ArchidektService.getDeckDetailsById(
        deck.externalId ?? "",
        true
      );
      await syncDeckDetails(deckDetails);
      navigate(0);
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  }

  async function syncDeckDetails(deckDetails: DeckDetails) {
    if (deck && deckDetails) {
      const update: DbDeck = { ...deck };
      let shouldUpdate = false;

      if (deck.name !== deckDetails.title) {
        update.name = deckDetails.title;
        shouldUpdate = true;
      }

      const commandersStr = deckDetails.commanders.join(" // ");
      if (deck.commander !== commandersStr) {
        update.commander = commandersStr;
        shouldUpdate = true;
      }

      if (deck.featured !== deckDetails.featured) {
        update.featured = deckDetails.featured;
        shouldUpdate = true;
      }

      if (deck.price !== deckDetails.price) {
        update.price = deckDetails.price;
        shouldUpdate = true;
      }

      if (deck.saltSum !== deckDetails.saltSum) {
        update.saltSum = deckDetails.saltSum;
        shouldUpdate = true;
      }

      if (deck.size !== deckDetails.size) {
        update.size = deckDetails.size;
        shouldUpdate = true;
      }

      if (deck.viewCount !== deckDetails.viewCount) {
        update.viewCount = deckDetails.viewCount;
        shouldUpdate = true;
      }

      if (deck.format !== deckDetails.format) {
        update.format = deckDetails.format;
        shouldUpdate = true;
      }

      if (deck.deckCreatedAt !== deckDetails.createdAt) {
        update.deckCreatedAt = deckDetails.createdAt;
        shouldUpdate = true;
      }

      if (deck.deckUpdatedAt !== deckDetails.updatedAt) {
        update.deckUpdatedAt = deckDetails.updatedAt;
        shouldUpdate = true;
      }

      if (!isEqual(deck.colourIdentity, deckDetails.colourIdentity)) {
        update.colourIdentity = deckDetails.colourIdentity;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        await DeckService.update(deck.id, update);
      }
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
            disabled={autofilling || syncing}
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
            disabled={!externalId || autofilling || syncing}
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
            disabled={autofilling || syncing}
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
            disabled={autofilling || syncing}
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
            disabled={autofilling || syncing}
          />
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Flex gap="3">
            <Dialog.Close
              disabled={autofilling || syncing}
              onClick={handleDelete}
            >
              <Button color="red">Delete</Button>
            </Dialog.Close>
            <Button
              disabled={syncing}
              loading={syncing}
              variant="soft"
              color="gray"
              onClick={handleSync}
            >
              Sync Data
            </Button>
          </Flex>
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
