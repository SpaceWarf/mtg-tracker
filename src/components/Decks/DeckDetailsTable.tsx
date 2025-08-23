import { Strong, Table, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import { DeckWithStats } from "../../state/Deck";
import { getLongDateString } from "../../utils/Date";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckDetailsTable({ deck }: OwnProps) {
  const tutors = useMemo(() => {
    return (
      deck.cards?.filter((card) => card.tutor).map((card) => card.name) ?? []
    );
  }, [deck.cards]);

  const massLandDenials = useMemo(() => {
    return (
      deck.cards
        ?.filter((card) => card.massLandDenial)
        .map((card) => card.name) ?? []
    );
  }, [deck.cards]);

  const extraTurns = useMemo(() => {
    return (
      deck.cards?.filter((card) => card.extraTurns).map((card) => card.name) ??
      []
    );
  }, [deck.cards]);

  return (
    <Table.Root variant="surface" size="1" layout="fixed">
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Game changers</Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={deck.gameChangers} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Tutors</Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={tutors} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">Extra turns</Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={extraTurns} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">
            Mass land denial
          </Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={massLandDenials} />
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

function CardNameList({ names }: { names: string[] }) {
  if (names.length === 0) {
    return (
      <Text size="2">
        <Strong>-</Strong>
      </Text>
    );
  }

  return (
    <ul style={{ listStyleType: "disc", marginLeft: "10px" }}>
      {names.map((name) => (
        <li>
          <Text size="2">
            <Strong>{name}</Strong>
          </Text>
        </li>
      ))}
    </ul>
  );
}
