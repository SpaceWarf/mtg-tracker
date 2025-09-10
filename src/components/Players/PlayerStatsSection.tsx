import { faChartLine, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { PlayerWithStats } from "../../state/Player";
import { DataCard } from "../Common/DataCard";
import { SimplePieChart } from "../Common/SimplePieChart";
import { PlayerGamesLineChart } from "./PlayerGamesLineChart";

type OwnProps = {
  player: PlayerWithStats;
};

export function PlayerStatsSection({ player }: OwnProps) {
  return (
    <Grid
      gap="5"
      columns={{ initial: "1", xs: "2", sm: "1", md: "2", lg: "3" }}
    >
      <DataCard
        title="Win Rate"
        icon={<FontAwesomeIcon icon={faPercent} />}
        align="center"
      >
        <Flex align="center" justify="center">
          <SimplePieChart
            value={player.winRate}
            label="Win %"
            size="large"
            colours={{
              "25": "#d84242",
              "50": "#FA9F42",
              "100": "#5abe8c",
            }}
          />
        </Flex>
      </DataCard>
      <DataCard
        title="Start Rate"
        icon={<FontAwesomeIcon icon={faPercent} />}
        align="center"
      >
        <Flex align="center" justify="center">
          <SimplePieChart
            value={player.startRate}
            label="Start %"
            size="large"
            colours={{
              "10": "#d84242",
              "25": "#FA9F42",
              "100": "#5abe8c",
            }}
          />
        </Flex>
      </DataCard>
      <DataCard
        title="T1 Sol Ring Rate"
        icon={<FontAwesomeIcon icon={faPercent} />}
        align="center"
      >
        <Flex align="center" justify="center">
          <SimplePieChart
            value={player.solRingRate}
            label="T1 Sol Ring %"
            size="large"
            colours={{
              "1": "#d84242",
              "10": "#FA9F42",
              "100": "#5abe8c",
            }}
          />
        </Flex>
      </DataCard>
      <Box
        gridColumn={{
          initial: "span 1",
          xs: "span 2",
          sm: "span 1",
          md: "span 2",
          lg: "span 3",
        }}
      >
        <DataCard
          title="Games"
          icon={<FontAwesomeIcon icon={faChartLine} />}
          align="center"
        >
          <Flex align="center" justify="center">
            <PlayerGamesLineChart player={player} />
          </Flex>
        </DataCard>
      </Box>
    </Grid>
  );
}
