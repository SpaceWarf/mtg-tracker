import { Flex, Link, Strong, Table, Text } from "@radix-ui/themes";
import { Combo } from "../../state/Combo";
import { DeckWithStats } from "../../state/Deck";
import { DeckCardDetails } from "../../state/DeckDetails";
import {
  EXTRA_TURN_LIMIT,
  GAME_CHANGER_LIMIT,
  MASS_LAND_DENIAL_LIMIT,
  TUTOR_LIMIT,
  TWO_CARD_COMBO_LIMIT,
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
            <CardNameList cards={deck.gameChangers} />
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
            <CardNameList cards={deck.tutors} />
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
            <CardNameList cards={deck.extraTurns} />
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
            <CardNameList cards={deck.massLandDenials} />
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.RowHeaderCell width="125px">
            <Flex direction="column">
              <Text>2 card combos</Text>
              {TWO_CARD_COMBO_LIMIT < 9999 && (
                <Text
                  size="1"
                  color={
                    deck.combos.length > TWO_CARD_COMBO_LIMIT ? "red" : "gray"
                  }
                >
                  max. {TWO_CARD_COMBO_LIMIT}
                </Text>
              )}
            </Flex>
          </Table.RowHeaderCell>
          <Table.Cell>
            <CardComboList combos={deck.combos} />
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

function CardNameList({ cards }: { cards: DeckCardDetails[] }) {
  if (cards.length === 0) {
    return (
      <Text size="2">
        <Strong>-</Strong>
      </Text>
    );
  }

  return (
    <ul>
      {cards.map((card) => (
        <li key={card.name}>
          <Link
            href={`https://scryfall.com/card/${card.setCode}/${card.collectorNumber}/`}
            target="_blank"
          >
            <Text size="2">
              <Strong>{card.name}</Strong>
            </Text>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CardComboList({ combos }: { combos: Combo[] }) {
  if (combos.length === 0) {
    return (
      <Text size="2">
        <Strong>-</Strong>
      </Text>
    );
  }

  return (
    <ul>
      {combos.map((combo) => (
        <li key={combo.name}>
          <Link href={`https://edhrec.com${combo.href}`} target="_blank">
            <Text size="2">
              <Strong>{combo.name.split(" (")[0]}</Strong>
            </Text>
          </Link>
        </li>
      ))}
    </ul>
  );
}
