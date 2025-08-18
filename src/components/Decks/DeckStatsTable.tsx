import { Flex, Strong, Table, Text } from "@radix-ui/themes";
import { usePlayers } from "../../hooks/usePlayers";
import { DeckWithStats } from "../../state/Deck";
import { SortHighlightIcon } from "../Icons/SortHighlightIcon";

type OwnProps = {
  deck: DeckWithStats;
  highlightedKey?: string;
  highlightedDirection?: "asc" | "desc";
};

export function DeckStatsTable({
  deck,
  highlightedKey,
  highlightedDirection = "asc",
}: OwnProps) {
  const { dbPlayers } = usePlayers();

  function getPlayerName(id: string): string {
    return (dbPlayers || []).find((player) => player.id === id)?.name ?? "-";
  }

  return (
    <Table.Root variant="surface" size="1" layout="fixed">
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell>Games played</Table.RowHeaderCell>
          <Table.Cell>
            <Flex gap="3" align="center">
              <Text size="4">
                <Strong>{deck.gamesPlayed}</Strong>
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
                <Strong>{deck.winCount}</Strong>
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
                <Strong>{`${Math.round(deck.winRate * 100)}%`}</Strong>
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
                <Strong>{getPlayerName(deck.builder ?? "")}</Strong>
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
