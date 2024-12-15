import { Card, Flex, Heading, Strong, Table, Text } from "@radix-ui/themes";
import { DbDeck } from "../state/Deck";

type OwnProps = {
  deck: DbDeck;
  gamesPlayed: number;
  winCount: number;
  winRate: number;
};

export function DeckCard({ deck, gamesPlayed, winCount, winRate }: OwnProps) {
  return (
    <Card size="3">
      <Flex className="mb-3" direction="column">
        <Heading>{deck.name}</Heading>
        <Heading size="3">({deck.commander})</Heading>
      </Flex>
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
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
