import {
  Button,
  Callout,
  Dialog,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckService } from "../../services/Deck";
import { Bracket } from "../../state/Bracket";
import { DbDeck } from "../../state/Deck";
import { DeckDetails } from "../../state/DeckDetails";
import { getDeckCommandersString } from "../../utils/Deck";
import { getPlayerByExternalId } from "../../utils/Player";
import { Icon } from "../Common/Icon";
import { BracketSelect } from "../Common/Select/BracketSelect";
import { PlayerSelect } from "../Common/Select/PlayerSelect";

type OwnProps = {
  open: boolean;
  deck: DbDeck;
  onClose: () => void;
};

export function DeckEditModal({ open, deck, onClose }: OwnProps) {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const [name, setName] = useState<string>(deck.name);
  const [commander, setCommander] = useState<string>(deck.commander ?? "");
  const [externalId, setExternalId] = useState<string>(deck.externalId ?? "");
  const [builder, setBuilder] = useState<string>(deck.builder ?? "");
  const [bracket, setBracket] = useState<Bracket | undefined>(deck.bracket);
  const [deckDetails, setDeckDetails] = useState<DeckDetails>();
  const [autofilling, setAutofilling] = useState<boolean>(false);
  const [autofillError, setAutofillError] = useState<string>("");

  async function handleSave() {
    const update: DbDeck = {
      ...cloneDeep(deck),
      name,
      commander,
      externalId,
      builder: builder ?? "",
      bracket: bracket ?? ("" as Bracket),
    };

    if (deckDetails) {
      update.featured = deckDetails.featured;
      update.price = deckDetails.price;
      update.saltSum = deckDetails.saltSum;
      update.size = deckDetails.size;
      update.viewCount = deckDetails.viewCount;
      update.format = deckDetails.format;
      update.deckCreatedAt = deckDetails.createdAt;
      update.deckUpdatedAt = deckDetails.updatedAt;
      update.colourIdentity = deckDetails.colourIdentity;
      update.cards = deckDetails.cards;
      update.categories = deckDetails.categories;
    }

    await DeckService.update(deck.id, update);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName(deck.name);
      setCommander(deck.commander ?? "");
      setBuilder(deck.builder ?? "");
      setExternalId(deck.externalId ?? "");
      onClose();
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
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Edit deck</Dialog.Title>

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
            disabled={autofilling}
          />
        </div>

        <div className="mb-5">
          <div className="mb-1">
            <p className="field-label mb-1">
              <b>Bracket</b>
            </p>
            <Text size="1" color="gray">
              Leaving this field empty will let the application automatically
              determine the bracket.
            </Text>
          </div>
          <BracketSelect
            value={bracket}
            onChange={setBracket}
            menuPlacement="top"
          />
        </div>

        <Flex gap="3" mt="4" mb="2" justify="between">
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <Icon icon="xmark" />
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canSave()} onClick={handleSave}>
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
