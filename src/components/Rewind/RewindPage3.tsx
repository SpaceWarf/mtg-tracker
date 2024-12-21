import "@assets/styles/Rewind.scss";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";
import {
  getPlayerGamesCount,
  getPlayerWinCount,
  getPlayerWinRate,
} from "../../utils/Player";

type RewindPage3OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

interface PlayerWinStats {
  player: DbPlayer;
  gamesCount: number;
  winCount: number;
  winRate: number;
}

export function RewindPage3({ players, games }: RewindPage3OwnProps) {
  const [winStats, setWinStats] = useState<PlayerWinStats[]>([]);

  useEffect(() => {
    const stats: PlayerWinStats[] = players
      .map((player) => ({
        player,
        gamesCount: getPlayerGamesCount(player, games),
        winCount: getPlayerWinCount(player, games),
        winRate: getPlayerWinRate(player, games),
      }))
      .sort((a, b) => b.winRate - a.winRate);
    setWinStats(stats);
  }, [players, games]);

  return (
    <div className="Page3 w-full h-full">
      <Heading
        className="RewindHeading Heading1 w-full"
        align="center"
        size="7"
        color="blue"
      >
        Let's see how that compares with the others
      </Heading>
      <WinRateRanking
        className="Heading2"
        player={winStats[0]?.player}
        gamesCount={winStats[0]?.gamesCount}
        winCount={winStats[0]?.winCount}
        winRate={winStats[0]?.winRate}
      />
      <WinRateRanking
        className="Heading3"
        player={winStats[1]?.player}
        gamesCount={winStats[1]?.gamesCount}
        winCount={winStats[1]?.winCount}
        winRate={winStats[1]?.winRate}
      />
      <WinRateRanking
        className="Heading4"
        player={winStats[2]?.player}
        gamesCount={winStats[2]?.gamesCount}
        winCount={winStats[2]?.winCount}
        winRate={winStats[2]?.winRate}
      />
      <WinRateRanking
        className="Heading5"
        player={winStats[3]?.player}
        gamesCount={winStats[3]?.gamesCount}
        winCount={winStats[3]?.winCount}
        winRate={winStats[3]?.winRate}
      />
      <WinRateRanking
        id="AnimationEndTrigger"
        className="Heading6"
        player={winStats[4]?.player}
        gamesCount={winStats[4]?.gamesCount}
        winCount={winStats[4]?.winCount}
        winRate={winStats[4]?.winRate}
      />
    </div>
  );
}

type WinRateRankingOwnProps = {
  player?: DbPlayer;
  gamesCount?: number;
  winCount?: number;
  winRate?: number;
  className: string;
  id?: string;
};

function WinRateRanking({
  player,
  gamesCount,
  winCount,
  winRate,
  className,
  id,
}: WinRateRankingOwnProps) {
  return (
    <Flex
      id={id}
      className={`RewindHeading ${className}`}
      gap="3"
      align="center"
    >
      <Avatar
        className="mt-1 w-28 h-28"
        src={`/img/pfp/${player?.id}.webp`}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="none"
      />
      <Flex direction="column">
        <Heading color="blue">{player?.name}</Heading>
        <Heading color="blue" size="4">
          {gamesCount} games played
        </Heading>
        <Heading color="blue" size="4">
          {winCount} wins / {Math.round((winRate ?? 0) * 100)}% win rate
        </Heading>
      </Flex>
    </Flex>
  );
}
