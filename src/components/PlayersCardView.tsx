import { Flex } from "@radix-ui/themes";
import { DbGame } from "../state/Game";
import { DbPlayer } from "../state/Player";
import {
  getPlayerGamesCount,
  getPlayerGamesStarted,
  getPlayerGamesStartedRate,
  getPlayerGamesStartedToWinRate,
  getPlayerGrandSlamCount,
  getPlayerSolRingCount,
  getPlayerSolRingRate,
  getPlayerSolRingToWinRate,
  getPlayerWinCount,
  getPlayerWinRate,
} from "../utils/Player";
import { PlayerCard } from "./PlayerCard";

type OwnProps = {
  players: DbPlayer[];
  games: DbGame[];
};

export function PlayersCardView({ players, games }: OwnProps) {
  return (
    <Flex flexGrow="1" gap="25px" wrap="wrap">
      {players
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((player) => (
          <div key={player.id} style={{ flexBasis: "calc(50% - 12.5px)" }}>
            <PlayerCard
              player={player}
              gamesPlayed={getPlayerGamesCount(player, games)}
              winCount={getPlayerWinCount(player, games)}
              winRate={getPlayerWinRate(player, games)}
              startCount={getPlayerGamesStarted(player, games)}
              startRate={getPlayerGamesStartedRate(player, games)}
              startToWinRate={getPlayerGamesStartedToWinRate(player, games)}
              solRingCount={getPlayerSolRingCount(player, games)}
              solRingRate={getPlayerSolRingRate(player, games)}
              solRingToWinRate={getPlayerSolRingToWinRate(player, games)}
              grandSlamCount={getPlayerGrandSlamCount(player, games)}
            />
          </div>
        ))}
    </Flex>
  );
}
