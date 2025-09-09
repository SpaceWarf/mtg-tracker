import { faChartLine, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import { DataCard } from "../Common/DataCard";
import { SimplePieChart } from "../Common/SimplePieChart";
import { DeckGamesLineChart } from "./DeckGamesLineChart";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckStatsSection({ deck }: OwnProps) {
  return (
    <Flex gap="5">
      <Flex width="25%">
        <DataCard
          title="Win Rate"
          icon={<FontAwesomeIcon icon={faPercent} />}
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
      </Flex>
      <Flex width="75%">
        <DataCard title="Games" icon={<FontAwesomeIcon icon={faChartLine} />}>
          <Flex align="center" justify="center">
            <DeckGamesLineChart deck={deck} />
          </Flex>
        </DataCard>
      </Flex>
    </Flex>
  );
}
