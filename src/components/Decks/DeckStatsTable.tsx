import { Flex, Strong, Table, Text } from "@radix-ui/themes";
import { SortHighlightIcon } from "../Icons/SortHighlightIcon";

type OwnProps = {
  highlightedKey?: string;
  highlightedDirection?: "asc" | "desc";
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  builder: string;
};

export function DeckStatsTable({
  highlightedKey,
  highlightedDirection = "asc",
  gamesPlayed,
  winCount,
  winRate,
  builder,
}: OwnProps) {
  return (
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
        <Table.Row>
          <Table.RowHeaderCell>Built by</Table.RowHeaderCell>
          <Table.Cell>
            <Flex gap="3" align="center">
              <Text size="4">
                <Strong>{builder}</Strong>
              </Text>
              <SortHighlightIcon
                highlighted={highlightedKey === "builder"}
                direction={highlightedDirection}
              />
            </Flex>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
