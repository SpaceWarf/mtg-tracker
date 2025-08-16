import {
  ExternalLinkIcon,
  EyeOpenIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Spinner,
} from "@radix-ui/themes";
import { isEqual } from "lodash";
import { useState } from "react";
import { ArchidektService } from "../../services/Archidekt";
import { DeckService } from "../../services/Deck";
import { DbDeck } from "../../state/Deck";
import { DeckDetails } from "../../state/DeckDetails";
import { DeckDetailsTable } from "./DeckDetailsTable";
import { DeckHeader } from "./DeckHeader";
import { DeckStatsTable } from "./DeckStatsTable";

type OwnProps = {
  deck: DbDeck;
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  builder: string;
};

export function DeckInspectModal({
  deck,
  gamesPlayed,
  winCount,
  winRate,
  builder,
}: OwnProps) {
  const [deckDetails, setDeckDetails] = useState<DeckDetails>();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleOpenChange(open: boolean) {
    if (open) {
      setLoading(true);
      try {
        const deckDetails = await ArchidektService.getDeckDetailsById(
          deck.externalId ?? ""
        );
        setDeckDetails(deckDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleSync() {
    setLoading(true);
    try {
      const deckDetails = await ArchidektService.getDeckDetailsById(
        deck.externalId ?? "",
        true
      );
      await syncDeckDetails(deckDetails);
      setDeckDetails(deckDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          <EyeOpenIcon width="18" height="18" />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content className="deck-inspect-modal">
        {(loading || !deckDetails) && (
          <>
            <Dialog.Title></Dialog.Title>
            <Spinner size="3" />
          </>
        )}

        {!loading && deckDetails && (
          <>
            <Dialog.Title>
              <Flex justify="between">
                <DeckHeader
                  title={deckDetails.title}
                  commanders={deckDetails.commanders.join(" // ")}
                  featured={deckDetails.featured}
                  colourIdentity={deckDetails.colourIdentity}
                />
                <IconButton
                  variant="soft"
                  onClick={() => window.open(deckDetails.url, "_blank")}
                >
                  <ExternalLinkIcon width="18" height="18" />
                </IconButton>
              </Flex>
            </Dialog.Title>

            <Heading size="3" className="mb-2 mt-5">
              Deck Stats
            </Heading>
            <DeckStatsTable
              gamesPlayed={gamesPlayed}
              winCount={winCount}
              winRate={winRate}
              builder={builder}
            />

            <Heading size="3" className="mb-2 mt-3">
              Deck Details
            </Heading>
            <DeckDetailsTable
              format={deckDetails.format}
              price={deckDetails.price}
              saltSum={deckDetails.saltSum}
              size={deckDetails.size}
              viewCount={deckDetails.viewCount}
              deckCreatedAt={deckDetails.createdAt}
              deckUpdatedAt={deckDetails.updatedAt}
            />
          </>
        )}

        <Flex gap="3" mt="4" justify="between">
          <Button
            disabled={loading}
            variant="soft"
            color="gray"
            onClick={handleSync}
          >
            <UpdateIcon width="18" height="18" />
            Sync Data
          </Button>
          <Dialog.Close>
            <Button>Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
