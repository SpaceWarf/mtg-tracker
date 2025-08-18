import { Strong, Table, Text } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckDetailsTable({ deck }: OwnProps) {
  return (
    <Table.Root variant="surface" size="1" layout="fixed">
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell>Format</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.format}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Game changers</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong style={{ whiteSpace: "pre-line" }}>
                {deck.gameChangers.length ? deck.gameChangers.join("\n") : "-"}
              </Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Estimated price (USD)</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.price}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Salt sum</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.saltSum}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Size</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.size}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>View count</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.viewCount}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Created at</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.deckCreatedAt?.split("T")[0]}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Last updated at</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.deckUpdatedAt?.split("T")[0]}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
