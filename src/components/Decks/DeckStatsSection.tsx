import { faCrown, faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import { DataCard } from "../Common/DataCard";
import { SimplePieChart } from "../Common/SimplePieChart";
import { DeckGamesLineChart } from "./DeckGamesLineChart";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckStatsSection({ deck }: OwnProps) {
  return (
    <Grid gap="5" columns={{ initial: "1", lg: "3", xl: "4" }}>
      <Box gridColumn="span 1">
        <DataCard
          title="Win Rate"
          icon={<FontAwesomeIcon icon={faCrown} />}
          align="center"
        >
          <Flex align="center" justify="center">
            <SimplePieChart
              value={deck.winRate}
              label="Win Rate"
              size="large"
              colours={{
                "25": "#d84242",
                "50": "#FA9F42",
                "100": "#5abe8c",
              }}
            />
          </Flex>
        </DataCard>
      </Box>
      <Box
        gridColumn={{
          initial: "span 1",
          lg: "span 2",
          xl: "span 3",
        }}
      >
        <DataCard title="Games" icon={<FontAwesomeIcon icon={faDice} />}>
          <Flex align="center" justify="center">
            <DeckGamesLineChart deck={deck} />
          </Flex>
        </DataCard>
      </Box>
    </Grid>
  );
}
