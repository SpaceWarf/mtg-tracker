import { Button, Callout, Dialog, Flex, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckService } from "../../services/Deck";
import { Bracket } from "../../state/Bracket";
import { Deck } from "../../state/Deck";
import { DeckDetails } from "../../state/DeckDetails";
import { getDeckCommandersString } from "../../utils/Deck";
import { getPlayerByExternalId } from "../../utils/Player";
import { Icon } from "../Common/Icon";
import { BracketSelect } from "../Common/Select/BracketSelect";
import { PlayerSelect } from "../Common/Select/PlayerSelect";

export function DeckCreateModal() {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const [name, setName] = useState<string>("");
  const [commander, setCommander] = useState<string>("");
  const [externalId, setExternalId] = useState<string>("");
  const [builder, setBuilder] = useState<string>("");
  const [bracket, setBracket] = useState<Bracket | undefined>();
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
      bracket: bracket ?? ("" as Bracket),
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
        <Button className="h-10" variant="soft">
          <Icon icon="plus" />
          Create
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Create deck</Dialog.Title>

        <div className="mb-3">
          <p className="field-label mb-1">
            <b>External ID</b>
          </p>
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
                <Icon icon="circle-info" />
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
            <Icon icon="pen" />
            Autofill Details
          </Button>
        </Flex>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Name</b>
          </p>
          <TextField.Root
            className="input-field"
            placeholder="Name..."
            value={name}
            disabled={autofilling}
            onChange={({ target }) => setName(target.value)}
          ></TextField.Root>
        </div>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Commander</b>
          </p>
          <TextField.Root
            className="input-field"
            placeholder="Commander..."
            value={commander}
            disabled={autofilling}
            onChange={({ target }) => setCommander(target.value)}
          ></TextField.Root>
        </div>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Built By</b>
          </p>
          <PlayerSelect
            value={builder as string}
            onChange={setBuilder}
            isMulti={false}
            menuPlacement="top"
          />
        </div>

        <div className="mb-5">
          <div className="mb-1">
            <p className="field-label">
              <b>Bracket</b>
            </p>
            <p className="text-muted">
              Leaving this field empty will let the application automatically
              determine the bracket.
            </p>
          </div>
          <BracketSelect
            value={bracket}
            onChange={setBracket}
            menuPlacement="top"
          />
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <Icon icon="xmark" />
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canSave()} onClick={handleCreate}>
            <Button className="h-10">
              <Icon icon="check" />
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
