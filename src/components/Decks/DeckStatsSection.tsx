import { faChartLine, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import { WinRatePieChart } from "../Common/WinRatePieChart";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckStatsSection({ deck }: OwnProps) {
  return (
    <Flex gap="5">
      <Flex className="data-card" direction="column" width="25%">
        <Flex className="title" align="center" gap="3" mb="5">
          <FontAwesomeIcon icon={faPercent} />
          <p>Win Rate</p>
        </Flex>
        <Flex align="center" justify="center">
          <WinRatePieChart deck={deck} size="large" />
        </Flex>
      </Flex>
      <Flex className="data-card" direction="column" flexGrow="1">
        <Flex className="title" align="center" gap="3" mb="5">
          <FontAwesomeIcon icon={faChartLine} />
          <p>Games Played</p>
        </Flex>
        <Flex align="center" justify="center">
          {/* TODO Chart */}
        </Flex>
      </Flex>
    </Flex>
  );
}
