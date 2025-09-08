import {
  faCrown,
  faDice,
  faDiceSix,
  faRing,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Grid, Tooltip } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import "../../assets/styles/PlayerCard.scss";
import { PlayerWithStats } from "../../state/Player";
import { SimplePieChart } from "../Common/SimplePieChart";
import { PlayerHeader2 } from "./PlayerHeader2";

type OwnProps = {
  player: PlayerWithStats;
  editable?: boolean;
  showActions?: boolean;
};

export function PlayerCard2({ player, editable, showActions }: OwnProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`player-card ${showActions ? "selectable" : ""}`}
      style={
        {
          ["--url" as string]: `url(/img/pfp/${player.id}.webp)`,
        } as React.CSSProperties
      }
      onClick={() => showActions && navigate(`/players/${player.id}`)}
    >
      <Flex className="h-full" direction="column" justify="between">
        <Flex className="content-container" direction="column" gap="3">
          <div>
            <PlayerHeader2
              player={player}
              editable={editable}
              showActions={showActions}
            />
          </div>
          <Flex justify="between">
            <Grid columns="2" gapX="4" gapY="0" align="center">
              <Tooltip content="Games Played">
                <Flex className="stat-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faDice} />
                  <p>{player.gamesPlayed}</p>
                </Flex>
              </Tooltip>
              <Tooltip content="Games Won">
                <Flex className="stat-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faCrown} />
                  <p>{player.winCount}</p>
                </Flex>
              </Tooltip>
              <Tooltip content="Games Started">
                <Flex className="stat-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faDiceSix} />
                  <p>{player.startCount}</p>
                </Flex>
              </Tooltip>
              <Tooltip content="T1 Sol Rings">
                <Flex className="stat-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faRing} />
                  <p>{player.solRingCount}</p>
                </Flex>
              </Tooltip>
            </Grid>
            <div className="win-percent-container">
              <SimplePieChart
                value={player.winRate}
                label="Win %"
                colours={{
                  "25": "#d84242",
                  "50": "#FA9F42",
                  "100": "#5abe8c",
                }}
              />
              <SimplePieChart
                value={player.startRate}
                label="Start %"
                colours={{
                  "10": "#d84242",
                  "25": "#FA9F42",
                  "100": "#5abe8c",
                }}
              />
              <SimplePieChart
                value={player.solRingRate}
                label="Sol Ring %"
                colours={{
                  "1": "#d84242",
                  "10": "#FA9F42",
                  "100": "#5abe8c",
                }}
              />
            </div>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
