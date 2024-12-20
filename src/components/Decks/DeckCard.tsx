import { ExternalLinkIcon } from "@radix-ui/react-icons";
import {
  Card,
  Flex,
  Heading,
  IconButton,
  Strong,
  Table,
  Text,
} from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { SortHighlightIcon } from "../Icons/SortHighlightIcon";
import { DeckEditModal } from "./DeckEditModal";

type OwnProps = {
  deck: DbDeck;
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
  gamesPlayed: number;
  winCount: number;
  winRate: number;
};

export function DeckCard({
  deck,
  editable,
  highlightedKey,
  highlightedDirection,
  gamesPlayed,
  winCount,
  winRate,
}: OwnProps) {
  return (
    <Card size="3">
      <Flex gap="3" className="absolute right-3 top-5" justify="end">
        {deck.url && (
          <IconButton
            variant="soft"
            onClick={() => window.open(deck.url, "_blank")}
          >
            <ExternalLinkIcon />
          </IconButton>
        )}
        {editable && <DeckEditModal deck={deck} />}
      </Flex>
      <Flex className="mb-3" direction="column">
        <Heading>{deck.name}</Heading>
        <Heading size="3">({deck.commander})</Heading>
      </Flex>
      <Table.Root variant="surface" size="1" layout="fixed">
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Games played</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{gamesPlayed}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "gamesPlayed"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Games won</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{winCount}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "winCount"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Win rate</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{`${Math.round(winRate * 100)}%`}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "winRate"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
