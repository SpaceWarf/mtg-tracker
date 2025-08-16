import { Strong, Table, Text } from "@radix-ui/themes";

type OwnProps = {
  format: string;
  price: string;
  saltSum: string;
  size: string;
  viewCount: string;
  deckCreatedAt: string;
  deckUpdatedAt: string;
};

export function DeckDetailsTable({
  format,
  price,
  saltSum,
  size,
  viewCount,
  deckCreatedAt,
  deckUpdatedAt,
}: OwnProps) {
  return (
    <Table.Root variant="surface" size="1" layout="fixed">
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell>Format</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{format}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Estimated Price (USD)</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{price}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Salt sum</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{saltSum}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Size</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{size}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>View count</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{viewCount}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Created at</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deckCreatedAt?.split("T")[0]}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell>Last updated at</Table.RowHeaderCell>
          <Table.Cell>
            <Text size="4">
              <Strong>{deckUpdatedAt?.split("T")[0]}</Strong>
            </Text>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
