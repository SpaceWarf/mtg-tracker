import {
  Box,
  Button,
  Callout,
  Flex,
  Grid,
  Heading,
  TextField,
} from "@radix-ui/themes";
import { useMemo, useState } from "react";
import "../../assets/styles/DataCard.scss";
import { useGameChangers } from "../../hooks/useGameChangers";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DeckDetails } from "../../state/DeckDetails";
import {
  EXTRA_TURN_LIMIT,
  GAME_CHANGER_LIMIT,
  MASS_LAND_DENIAL_LIMIT,
  TUTOR_LIMIT,
} from "../../utils/Bracket";
import { populateDeckDetails } from "../../utils/Deck";
import { DataCard } from "../Common/DataCard";
import { Icon } from "../Common/Icon";
import { DeckCardPreviewSection } from "../Decks/DeckCardPreviewSection";
import { DeckShowcase } from "../Decks/DeckShowcase";

export function DeckValidatorViewer() {
  const { dbPlayers } = usePlayers();

  const [externalId, setExternalId] = useState<string>("");
  const [deckDetails, setDeckDetails] = useState<DeckDetails>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { gameChangers } = useGameChangers();
  const populatedDeck = useMemo(() => {
    return deckDetails
      ? populateDeckDetails(deckDetails, gameChangers, dbPlayers ?? [])
      : undefined;
  }, [dbPlayers, deckDetails, gameChangers]);

  const cardPreviewSectionCount = useMemo(() => {
    let count = 0;

    if (!populatedDeck) {
      return count;
    }

    if (populatedDeck.gameChangers.length > 0) {
      count++;
    }

    if (populatedDeck.tutors.length > 0) {
      count++;
    }

    if (populatedDeck.extraTurns.length > 0) {
      count++;
    }

    if (populatedDeck.massLandDenials.length > 0) {
      count++;
    }

    return count;
  }, [populatedDeck]);

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
      <Grid columns="1" gap="5">
        <DataCard
          title="Deck Validator"
          icon={<Icon icon="check" />}
          direction="row"
          pageHeader
        />
        <Flex className="data-card" align="center" justify="start" gap="5">
          <Box width="300px">
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
          </Box>
          <Box className="mt-6">
            <Button
              className="h-10"
              onClick={handleValidate}
              disabled={!externalId || loading}
              loading={loading}
            >
              <Icon icon="check-circle" />
              Validate
            </Button>
          </Box>
          {error && (
            <Callout.Root color="red" className="mt-6">
              <Callout.Icon>
                <Icon icon="exclamation-triangle" />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
        </Flex>
        {populatedDeck && (
          <Grid columns={{ initial: "1", md: "5", lg: "7" }} gap="5">
            <Box gridColumn={{ initial: "span 1", md: "span 2", lg: "span 2" }}>
              <DeckShowcase deck={populatedDeck} />
            </Box>
            <Grid
              gap="5"
              columns="1"
              gridColumn={{ initial: "span 1", md: "span 3", lg: "span 5" }}
            >
              <Box>
                {cardPreviewSectionCount > 0 && (
                  <Grid
                    gap="5"
                    columns={{
                      initial: "1",
                      lg: `${Math.min(2, cardPreviewSectionCount)}`,
                    }}
                  >
                    {populatedDeck.gameChangers.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Game Changers (${populatedDeck.gameChangers.length})`}
                        icon={<Icon icon="gem" />}
                        cards={populatedDeck.gameChangers}
                        error={
                          populatedDeck.gameChangers.length > GAME_CHANGER_LIMIT
                        }
                      />
                    )}
                    {populatedDeck.tutors.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Tutors (${populatedDeck.tutors.length})`}
                        icon={<Icon icon="magnifying-glass-plus" />}
                        cards={populatedDeck.tutors}
                        error={populatedDeck.tutors.length > TUTOR_LIMIT}
                      />
                    )}
                    {populatedDeck.extraTurns.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Extra Turns (${populatedDeck.extraTurns.length})`}
                        icon={<Icon icon="forward" />}
                        cards={populatedDeck.extraTurns}
                        error={
                          populatedDeck.extraTurns.length > EXTRA_TURN_LIMIT
                        }
                      />
                    )}
                    {populatedDeck.massLandDenials.length > 0 && (
                      <DeckCardPreviewSection
                        title={`Mass Land Denials (${populatedDeck.massLandDenials.length})`}
                        icon={<Icon icon="bomb" />}
                        cards={populatedDeck.massLandDenials}
                        error={
                          populatedDeck.massLandDenials.length >
                          MASS_LAND_DENIAL_LIMIT
                        }
                      />
                    )}
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
