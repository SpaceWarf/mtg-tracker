import { Box, Flex, Grid, Tooltip } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import "../../assets/styles/PlayerCard.scss";
import { PlayerWithStats } from "../../state/Player";
import { Icon } from "../Common/Icon";
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
      className={`player-card w-full ${showActions ? "selectable" : ""}`}
      style={
        {
          ["--url" as string]: `url(/img/pfp/${player.id}.webp)`,
        } as React.CSSProperties
      }
      onClick={() => showActions && navigate(`/players/${player.id}`)}
    >
      <Flex className="h-full" direction="column" justify="between">
        <Flex className="content-container" direction="column" gap="3">
          <PlayerHeader2
            player={player}
            editable={editable}
            showActions={showActions}
          />
          <Flex justify="between">
            <Grid columns="2" gapX="4">
              <Tooltip content="Games Played">
                <Flex className="stat-container" gap="2">
                  <Icon size="lg" icon="dice" />
                  <p>{player.gamesPlayed}</p>
                </Flex>
              </Tooltip>
              <Tooltip content="Games Won">
                <Flex className="stat-container" gap="2">
                  <Icon size="lg" icon="crown" />
                  <p>{player.winCount}</p>
                </Flex>
              </Tooltip>
            </Grid>
            <Box className="win-percent-container">
              <SimplePieChart
                value={player.winRate}
                label="Win %"
                colours={{
                  "25": "#d84242",
                  "50": "#FA9F42",
                  "100": "#5abe8c",
                }}
              />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
