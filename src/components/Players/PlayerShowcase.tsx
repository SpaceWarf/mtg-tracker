import { Flex } from "@radix-ui/themes";
import "../../assets/styles/PlayerShowcase.scss";
import { PlayerWithStats } from "../../state/Player";
import { Icon } from "../Common/Icon";
import { PlayerHeader2 } from "./PlayerHeader2";

type OwnProps = {
  player: PlayerWithStats;
};

export function PlayerShowcase({ player }: OwnProps) {
  return (
    <div className="player-showcase">
      <Flex
        className="header"
        direction="column"
        gap="5"
        style={
          {
            ["--url" as string]: `url(/img/pfp/${player.id}.webp)`,
          } as React.CSSProperties
        }
      >
        <PlayerHeader2 player={player} />
        <Flex
          className="win-ratio"
          justify="center"
          align="center"
          gap="2"
          mt="1"
        >
          <Flex direction="column" align="center" gap="1">
            <p className="value win-count">{player.winCount}</p>
            <p className="label">Wins</p>
          </Flex>
          <p className="value mb-6">-</p>
          <Flex direction="column" align="center" gap="1">
            <p className="value loss-count">
              {player.gamesPlayed - player.winCount}
            </p>
            <p className="label">Losses</p>
          </Flex>
        </Flex>
      </Flex>
      <Flex direction="column" className="stats-table">
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="dice" />
            <p>Games Played</p>
          </Flex>
          <p className="value">{player.gamesPlayed}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="crown" />
            <p>Games Won</p>
          </Flex>
          <p className="value">{player.winCount}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="dice-six" />
            <p>Games Started</p>
          </Flex>
          <p className="value">{player.startCount}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="ring" />
            <p>T1 Sol Rings</p>
          </Flex>
          <p className="value">{player.solRingCount}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="baseball-bat-ball" />
            <p>Grand Slams</p>
          </Flex>
          <p className="value">{player.grandSlamCount}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="hammer" />
            <p>Decks Built</p>
          </Flex>
          <p className="value">{player.decksBuilt}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="cards-blank" />
            <p>Decks Played</p>
          </Flex>
          <p className="value">
            {
              Array.from(player.deckStatsMap.entries()).filter(
                (deck) => deck[1].played > 0
              ).length
            }
          </p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <Icon size="lg" icon="crown" />
            <p>Decks Won With</p>
          </Flex>
          <p className="value">
            {
              Array.from(player.deckStatsMap.entries()).filter(
                (deck) => deck[1].won > 0
              ).length
            }
          </p>
        </Flex>
      </Flex>
    </div>
  );
}
