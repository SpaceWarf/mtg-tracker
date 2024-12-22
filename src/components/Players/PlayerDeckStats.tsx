import { Flex, Heading, Strong, Table, Text } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { DeckPlayStats } from "../../state/PlayerDeckStats";
import { SortHighlightIcon } from "../Icons/SortHighlightIcon";

type OwnProps = {
  decks: DbDeck[];
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
  deckPlayedMap: Map<string, number>;
  deckWonMap: Map<string, number>;
};

export function PlayerDeckStats({
  decks,
  highlightedKey,
  highlightedDirection,
  deckPlayedMap,
  deckWonMap,
}: OwnProps) {
  const deck1PlayedStats = getStatsForDeckAtIndex(0, "played");
  const deck2PlayedStats = getStatsForDeckAtIndex(1, "played");
  const deck3PlayedStats = getStatsForDeckAtIndex(2, "played");
  const deck4PlayedStats = getStatsForDeckAtIndex(3, "played");
  const deck5PlayedStats = getStatsForDeckAtIndex(4, "played");

  const deck1WonStats = getStatsForDeckAtIndex(0, "won");
  const deck2WonStats = getStatsForDeckAtIndex(1, "won");
  const deck3WonStats = getStatsForDeckAtIndex(2, "won");
  const deck4WonStats = getStatsForDeckAtIndex(3, "won");
  const deck5WonStats = getStatsForDeckAtIndex(4, "won");

  function getOrderedIndexFromMap(
    map: Map<string, number>,
    idx: number
  ): string {
    const entry = [...map.entries()].sort((a, b) => b[1] - a[1])[idx];
    return entry ? entry[0] : "";
  }

  function getStatsForDeckAtIndex(
    idx: number,
    orderBy: "played" | "won"
  ): DeckPlayStats {
    const deckId = getOrderedIndexFromMap(
      orderBy === "played" ? deckPlayedMap : deckWonMap,
      idx
    );
    const deck = decks.find((deck) => deck.id === deckId);

    return {
      deck: deck ?? ({} as DbDeck),
      gamesPlayed: deckPlayedMap.get(deckId) ?? 0,
      gamesWon: deckWonMap.get(deckId) ?? 0,
    };
  }

  function getUniqueDecksPlayed(): number {
    return [...deckPlayedMap.values()].filter((value) => value > 0).length;
  }

  function getUniqueDecksWonWith(): number {
    return [...deckWonMap.values()].filter((value) => value > 0).length;
  }

  return (
    <Flex justify="center" wrap="wrap">
      <Table.Root className="mb-5" variant="surface" size="1" layout="fixed">
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Unique decks played</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{getUniqueDecksPlayed()}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "uniqueDecksPlayed"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Unique deck wins</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{getUniqueDecksWonWith()}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "uniqueDecksWon"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <div className="w-3/6">
        <Heading className="mb-2" size="5">
          Most Played
        </Heading>
        <ol className="ml-4" style={{ listStyle: "numbered" }}>
          <li className="mb-2">
            <DeckListEntry
              deck={deck1PlayedStats.deck}
              stat={deck1PlayedStats.gamesPlayed}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck2PlayedStats.deck}
              stat={deck2PlayedStats.gamesPlayed}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck3PlayedStats.deck}
              stat={deck3PlayedStats.gamesPlayed}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck4PlayedStats.deck}
              stat={deck4PlayedStats.gamesPlayed}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck5PlayedStats.deck}
              stat={deck5PlayedStats.gamesPlayed}
            />
          </li>
        </ol>
      </div>
      <div className="w-3/6">
        <Heading className="mb-2" size="5">
          Most Wins
        </Heading>
        <ol className="ml-4" style={{ listStyle: "numbered" }}>
          <li className="mb-2">
            <DeckListEntry
              deck={deck1WonStats.deck}
              stat={deck1WonStats.gamesWon}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck2WonStats.deck}
              stat={deck2WonStats.gamesWon}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck3WonStats.deck}
              stat={deck3WonStats.gamesWon}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck4WonStats.deck}
              stat={deck4WonStats.gamesWon}
            />
          </li>
          <li className="mb-2">
            <DeckListEntry
              deck={deck5WonStats.deck}
              stat={deck5WonStats.gamesWon}
            />
          </li>
        </ol>
      </div>
    </Flex>
  );
}

type DeckListEntryOwnProps = {
  deck: DbDeck;
  stat: number;
};

export function DeckListEntry({ deck, stat }: DeckListEntryOwnProps) {
  return (
    <Flex direction="column">
      {deck.name && (
        <>
          <Text size="3">
            <b>{deck.name}</b> ({stat})
          </Text>
          <Text size="2">{deck.commander}</Text>
        </>
      )}
    </Flex>
  );
}
