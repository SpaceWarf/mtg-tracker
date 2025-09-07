import { faChartLine, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import { DataCard } from "../Common/DataCard";
import { WinRatePieChart } from "../Common/WinRatePieChart";

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
            <WinRatePieChart deck={deck} size="large" />
          </Flex>
        </DataCard>
      </Flex>
      <Flex width="75%">
        <DataCard
          title="Games Played"
          icon={<FontAwesomeIcon icon={faChartLine} />}
        >
          <Flex align="center" justify="center">
            {/* TODO Chart */}
          </Flex>
        </DataCard>
      </Flex>
    </Flex>
  );
}
