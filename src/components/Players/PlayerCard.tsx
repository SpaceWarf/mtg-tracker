import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Card, Flex, Heading, Tabs } from "@radix-ui/themes";
import { useState } from "react";
import { DbDeck } from "../../state/Deck";
import { DbPlayer } from "../../state/Player";
import { PlayerCardView } from "../../state/PlayerCardView";
import { PlayerDeckStats } from "./PlayerDeckStats";
import { PlayerEditModal } from "./PlayerEditModal";
import { PlayerGameStats } from "./PlayerGameStats";

type OwnProps = {
  player: DbPlayer;
  decks: DbDeck[];
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
  deckPlayedMap: Map<string, number>;
  deckWonMap: Map<string, number>;
};

export function PlayerCard({
  player,
  decks,
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
  deckPlayedMap,
  deckWonMap,
}: OwnProps) {
  const [view, setView] = useState<PlayerCardView>(PlayerCardView.GAME_STATS);

  return (
    <Card size="3">
      {editable && (
        <Flex gap="3" className="absolute right-3 top-5" justify="end">
          <PlayerEditModal player={player} />
        </Flex>
      )}
      <Flex className="mb-1" gap="3" align="center">
        <Avatar
          src={`/img/pfp/${player.id}.webp`}
          fallback={<FontAwesomeIcon icon={faUser} />}
          radius="full"
          size="5"
        />
        <Heading>{player.name}</Heading>
      </Flex>
      <Tabs.Root className="mb-2" value={view}>
        <Tabs.List size="2">
          <Tabs.Trigger
            value={PlayerCardView.GAME_STATS}
            onClick={() => setView(PlayerCardView.GAME_STATS)}
          >
            Game Stats
          </Tabs.Trigger>
          <Tabs.Trigger
            value={PlayerCardView.DECK_STATS}
            onClick={() => setView(PlayerCardView.DECK_STATS)}
          >
            Deck Stats
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {view === PlayerCardView.GAME_STATS && (
        <PlayerGameStats
          highlightedKey={highlightedKey}
          highlightedDirection={highlightedDirection}
          gamesPlayed={gamesPlayed}
          winCount={winCount}
          winRate={winRate}
          startCount={startCount}
          startRate={startRate}
          startToWinRate={startToWinRate}
          solRingCount={solRingCount}
          solRingRate={solRingRate}
          solRingToWinRate={solRingToWinRate}
          grandSlamCount={grandSlamCount}
        />
      )}

      {view === PlayerCardView.DECK_STATS && (
        <PlayerDeckStats
          decks={decks}
          highlightedKey={highlightedKey}
          highlightedDirection={highlightedDirection}
          deckPlayedMap={deckPlayedMap}
          deckWonMap={deckWonMap}
        />
      )}
    </Card>
  );
}
