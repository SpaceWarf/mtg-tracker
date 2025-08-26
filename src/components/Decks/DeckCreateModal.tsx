import {
  CheckIcon,
  Cross2Icon,
  InfoCircledIcon,
  Pencil1Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Callout,
  Dialog,
  Flex,
  Heading,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckService } from "../../services/Deck";
import { Deck } from "../../state/Deck";
import { DeckDetails } from "../../state/DeckDetails";
import { getDeckCommandersString } from "../../utils/Deck";
import { getPlayerByExternalId } from "../../utils/Player";
import { PlayerSelect } from "../Select/PlayerSelect";

export function DeckCreateModal() {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const [name, setName] = useState<string>("");
  const [commander, setCommander] = useState<string>("");
  const [externalId, setExternalId] = useState<string>("");
  const [builder, setBuilder] = useState<string>("");
  const [deckDetails, setDeckDetails] = useState<DeckDetails>();
  const [autofilling, setAutofilling] = useState<boolean>(false);
  const [autofillError, setAutofillError] = useState<string>("");

  async function handleCreate() {
    const deck: Deck = {
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
      cards: deckDetails?.cards ?? [],
      categories: deckDetails?.categories ?? [],
      versions: [],
      latestVersionId: "",
    };
    await DeckService.create(deck);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName("");
      setCommander("");
      setBuilder("");
      setExternalId("");
    }
  }

  function canSave(): boolean {
    return !!name && !autofilling;
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

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button className="h-10">
          <PlusIcon width="18" height="18" />
          Create new deck
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Create deck</Dialog.Title>

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
            loading={autofilling}
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
            disabled={autofilling}
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
            disabled={autofilling}
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
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <Cross2Icon /> Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canSave()} onClick={handleCreate}>
            <Button className="h-10">
              <CheckIcon /> Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
