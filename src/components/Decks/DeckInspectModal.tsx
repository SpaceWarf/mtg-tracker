import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ExternalLinkIcon,
  EyeOpenIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Strong,
  Table,
  Text,
} from "@radix-ui/themes";
import { useState } from "react";
import { ArchidektService } from "../../services/Archidekt";
import { DeckService } from "../../services/Deck";
import { DbDeck } from "../../state/Deck";
import { DeckDetails } from "../../state/DeckDetails";

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
                <Flex gap="2" align="center">
                  <Avatar
                    src={deckDetails.featured}
                    fallback={<FontAwesomeIcon icon={faUser} />}
                    radius="full"
                    size="6"
                  />
                  <Flex direction="column">
                    <span className="text-lg">{deckDetails.title}</span>
                    <span className="text-sm">
                      {deckDetails.commanders.join(" // ")}
                    </span>
                  </Flex>
                </Flex>
                <IconButton
                  variant="soft"
                  onClick={() => window.open(deckDetails.url, "_blank")}
                >
                  <ExternalLinkIcon width="18" height="18" />
                </IconButton>
              </Flex>
            </Dialog.Title>

            <Heading size="3" className="mb-2 mt-3">
              Deck Details
            </Heading>
            <Table.Root variant="surface" size="1" layout="fixed">
              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell>Format</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{deckDetails.format}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>
                    Estimated Price (USD)
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{deckDetails.price}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Salt sum</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{deckDetails.saltSum}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Size</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{deckDetails.size}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>View count</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{deckDetails.viewCount}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Created at</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{deckDetails.createdAt.split("T")[0]}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Last updated at</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{deckDetails.updatedAt.split("T")[0]}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            <Heading size="3" className="mb-2 mt-5">
              Deck Stats
            </Heading>
            <Table.Root variant="surface" size="1" layout="fixed">
              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell>Games played</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{gamesPlayed}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Games won</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{winCount}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Win rate</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{`${Math.round(winRate * 100)}%`}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Built by</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="4">
                      <Strong>{builder}</Strong>
                    </Text>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
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
