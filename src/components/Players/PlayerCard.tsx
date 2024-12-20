import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Card,
  Flex,
  Heading,
  Strong,
  Table,
  Text,
} from "@radix-ui/themes";
import { DbPlayer } from "../../state/Player";
import { SortHighlightIcon } from "../Icons/SortHighlightIcon";
import { PlayerEditModal } from "./PlayerEditModal";

type OwnProps = {
  player: DbPlayer;
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  startCount: number;
  startRate: number;
  startToWinRate: number;
  solRingCount: number;
  solRingRate: number;
  solRingToWinRate: number;
  grandSlamCount: number;
};

export function PlayerCard({
  player,
  editable,
  highlightedKey,
  highlightedDirection,
  gamesPlayed,
  winCount,
  winRate,
  startCount,
  startRate,
  startToWinRate,
  solRingCount,
  solRingRate,
  solRingToWinRate,
  grandSlamCount,
}: OwnProps) {
  return (
    <Card size="3">
      {editable && (
        <Flex gap="3" className="absolute right-3 top-5" justify="end">
          <PlayerEditModal player={player} />
        </Flex>
      )}
      <Flex className="mb-5" gap="3" align="center">
        <Avatar
          src={`/img/pfp/${player.id}.webp`}
          fallback={<FontAwesomeIcon icon={faUser} />}
          radius="full"
          size="5"
        />
        <Heading>{player.name}</Heading>
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
            <Table.RowHeaderCell>Start to win rate</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{`${Math.round(startToWinRate * 100)}%`}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "startToWinRate"}
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
            <Table.RowHeaderCell>Turn 1 Sol Rings</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{solRingCount}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "solRingCount"}
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
            <Table.RowHeaderCell>Turn 1 Sol Rings rate</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{`${Math.round(solRingRate * 100)}%`}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "solRingRate"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Games started</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{startCount}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "startCount"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
            <Table.RowHeaderCell>T1 Sol Ring to win rate</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{`${Math.round(solRingToWinRate * 100)}%`}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "solRingToWinRate"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Start rate</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{`${Math.round(startRate * 100)}%`}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "startRate"}
                  direction={highlightedDirection}
                />
              </Flex>
            </Table.Cell>
            <Table.RowHeaderCell>Grand Slams</Table.RowHeaderCell>
            <Table.Cell>
              <Flex gap="3" align="center">
                <Text size="4">
                  <Strong>{grandSlamCount}</Strong>
                </Text>
                <SortHighlightIcon
                  highlighted={highlightedKey === "grandSlamCount"}
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
