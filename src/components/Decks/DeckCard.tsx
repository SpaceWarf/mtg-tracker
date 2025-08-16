import { Card, Flex, Strong, Table, Text } from "@radix-ui/themes";
import { usePlayers } from "../../hooks/usePlayers";
import { DbDeck } from "../../state/Deck";
import { SortHighlightIcon } from "../Icons/SortHighlightIcon";
import { DeckEditModal } from "./DeckEditModal";
import { DeckHeader } from "./DeckHeader";
import { DeckInspectModal } from "./DeckInspectModal";

type OwnProps = {
  deck: DbDeck;
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
  gamesPlayed: number;
  winCount: number;
  winRate: number;
};

export function DeckCard({
  deck,
  editable,
  highlightedKey,
  highlightedDirection,
  gamesPlayed,
  winCount,
  winRate,
}: OwnProps) {
  const { dbPlayers } = usePlayers();

  function getPlayerName(id: string): string {
    return (dbPlayers || []).find((player) => player.id === id)?.name ?? "-";
  }

  return (
    <Card size="3">
      <Flex className="mb-3" justify="between">
        <DeckHeader
          title={deck.name}
          commanders={deck.commander}
          featured={deck.featured ?? ""}
          colourIdentity={deck.colourIdentity ?? []}
          size="small"
        />
        <Flex className="ml-2" gap="3">
          {deck.externalId && (
            <DeckInspectModal
              deck={deck}
              gamesPlayed={gamesPlayed}
              winCount={winCount}
              winRate={winRate}
              builder={getPlayerName(deck.builder ?? "")}
            />
          )}
          {editable && <DeckEditModal deck={deck} />}
        </Flex>
      </Flex>
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
    </Card>
  );
}
