import { CheckCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Callout, Flex, Heading, TextField } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useGameChangers } from "../../hooks/useGameChangers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckDetails } from "../../state/DeckDetails";
import { populateDeckDetails } from "../../utils/Deck";
import { DeckDetailsTable } from "../Decks/DeckDetailsTable";
import { DeckHeader } from "../Decks/DeckHeader";

export function DeckValidatorViewer() {
  const [externalId, setExternalId] = useState<string>("");
  const [deckDetails, setDeckDetails] = useState<DeckDetails>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { gameChangers } = useGameChangers();
  const populatedDeck = useMemo(() => {
    return deckDetails
      ? populateDeckDetails(deckDetails, gameChangers)
      : undefined;
  }, [deckDetails, gameChangers]);

  async function handleValidate() {
    setLoading(true);
    setError("");
    try {
      const deckDetails = await ArchidektService.getDeckDetailsById(externalId);
      setDeckDetails(deckDetails);
    } catch (error) {
      console.error(error);
      setError("Invalid External ID.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5 w-full max-w-[1950px]">
      <Flex direction="column" align="center">
        <Flex width="300px" direction="column" justify="center">
          <div className="mb-3">
            <Heading className="mb-1" size="3">
              External ID
            </Heading>
            <TextField.Root
              className="input-field"
              placeholder="External ID..."
              value={externalId}
              disabled={loading}
              onChange={({ target }) => setExternalId(target.value)}
            ></TextField.Root>
            {error && (
              <Callout.Root color="red" className="mt-2">
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}
          </div>
          <Flex className="mb-5" justify="center">
            <Button
              className="h-10"
              onClick={handleValidate}
              disabled={!externalId || loading}
              loading={loading}
            >
              <CheckCircledIcon width="18" height="18" />
              Validate Deck
            </Button>
          </Flex>
        </Flex>
        {populatedDeck && (
          <Flex width="750px" direction="column" gap="3">
            <DeckHeader deck={populatedDeck} />
            <DeckDetailsTable deck={populatedDeck} />
          </Flex>
        )}
      </Flex>
    </div>
  );
}
