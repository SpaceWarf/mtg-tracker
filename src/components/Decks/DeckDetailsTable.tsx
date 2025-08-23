import { Flex, Strong, Table, Text } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import {
  EXTRA_TURN_LIMIT,
  GAME_CHANGER_LIMIT,
  MASS_LAND_DENIAL_LIMIT,
  TUTOR_LIMIT,
} from "../../utils/Bracket";
import { getLongDateString } from "../../utils/Date";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckDetailsTable({ deck }: OwnProps) {
  return (
    <Table.Root variant="surface" size="1" layout="fixed">
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell width="125px">
            <Flex direction="column">
              <Text>Game changers</Text>
              {GAME_CHANGER_LIMIT < 9999 && (
                <Text
                  size="1"
                  color={
                    deck.gameChangers.length > GAME_CHANGER_LIMIT
                      ? "red"
                      : "gray"
                  }
                >
                  max. {GAME_CHANGER_LIMIT}
                </Text>
              )}
            </Flex>
          </Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={deck.gameChangers} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">
            <Flex direction="column">
              <Text>Tutors</Text>
              {TUTOR_LIMIT < 9999 && (
                <Text
                  size="1"
                  color={deck.tutors.length > TUTOR_LIMIT ? "red" : "gray"}
                >
                  max. {TUTOR_LIMIT}
                </Text>
              )}
            </Flex>
          </Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={deck.tutors} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">
            <Flex direction="column">
              <Text>Extra turns</Text>
              {EXTRA_TURN_LIMIT < 9999 && (
                <Text
                  size="1"
                  color={
                    deck.extraTurns.length > EXTRA_TURN_LIMIT ? "red" : "gray"
                  }
                >
                  max. {EXTRA_TURN_LIMIT}
                </Text>
              )}
            </Flex>
          </Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={deck.extraTurns} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeaderCell width="125px">
            <Flex direction="column">
              <Text>Mass land denials</Text>
              {MASS_LAND_DENIAL_LIMIT < 9999 && (
                <Text
                  size="1"
                  color={
                    deck.massLandDenials.length > MASS_LAND_DENIAL_LIMIT
                      ? "red"
                      : "gray"
                  }
                >
                  max. {MASS_LAND_DENIAL_LIMIT}
                </Text>
              )}
            </Flex>
          </Table.RowHeaderCell>
          <Table.Cell>
            <CardNameList names={deck.massLandDenials} />
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
    <ul>
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
