import { Strong, Table, Text } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import { getLongDateString } from "../../utils/Date";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckDetailsTable({ deck }: OwnProps) {
  return (
    <Table.Root variant="surface" size="1" layout="fixed">
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Game changers</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong style={{ whiteSpace: "pre-line" }}>
                {deck.gameChangers.length ? deck.gameChangers.join("\n") : "-"}
              </Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Est. price</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.price}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Salt sum</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.saltSum}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Size</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.size}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">View count</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deck.viewCount}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Created at</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{getLongDateString(deck.createdAt ?? "", false)}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">
            Last updated at
          </Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{getLongDateString(deck.updatedAt ?? "", false)}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
