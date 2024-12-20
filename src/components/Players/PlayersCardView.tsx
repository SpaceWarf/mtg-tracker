import { Flex } from "@radix-ui/themes";
import { useAuth } from "../../hooks/useAuth";
import { PlayerWithStats } from "../../state/Player";
import { PlayerCard } from "./PlayerCard";

type OwnProps = {
  players: PlayerWithStats[];
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function PlayersCardView({
  players,
  highlightedKey,
  highlightedDirection,
}: OwnProps) {
  const auth = useAuth();

  return (
    <Flex flexGrow="1" gap="25px" wrap="wrap">
      {players.map((player) => (
        <div key={player.id} style={{ flexBasis: "calc(33.33% - 16.66px)" }}>
          <PlayerCard
            player={player}
            editable={!!auth.user}
            highlightedKey={highlightedKey}
            highlightedDirection={highlightedDirection}
            gamesPlayed={player.gamesPlayed}
            winCount={player.winCount}
            winRate={player.winRate}
            startCount={player.startCount}
            startRate={player.startRate}
            startToWinRate={player.startToWinRate}
            solRingCount={player.solRingCount}
            solRingRate={player.solRingRate}
            solRingToWinRate={player.solRingToWinRate}
            grandSlamCount={player.grandSlamCount}
          />
        </div>
      ))}
    </Flex>
  );
}
