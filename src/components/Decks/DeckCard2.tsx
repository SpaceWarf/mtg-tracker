import { faCrown, faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Tooltip } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import "../../assets/styles/DeckCard.scss";
import { DeckWithStats } from "../../state/Deck";
import { SimplePieChart } from "../Common/SimplePieChart";
import { DeckHeader2 } from "./DeckHeader2";
import { DeckTags } from "./DeckTags";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
  showActions?: boolean;
};

export function DeckCard2({ deck, editable, showActions }: OwnProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`deck-card ${showActions ? "selectable" : ""}`}
      style={
        {
          ["--url" as string]: `url(${deck.featured})`,
        } as React.CSSProperties
      }
      onClick={() => showActions && navigate(`/decks/${deck.id}`)}
    >
      <Flex className="h-full" direction="column" justify="between">
        <Flex className="content-container" direction="column" gap="3">
          <div>
            <DeckHeader2
              deck={deck}
              editable={editable}
              showActions={showActions}
            />
          </div>
          <Flex justify="between">
            <Flex mt="2" gap="4">
              <Tooltip content="Games Played">
                <Flex className="stat-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faDice} />
                  <p>{deck.gamesPlayed}</p>
                </Flex>
              </Tooltip>
              <Tooltip content="Games Won">
                <Flex className="stat-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faCrown} />
                  <p>{deck.winCount}</p>
                </Flex>
              </Tooltip>
            </Flex>
            <div className="win-percent-container mt-[-20px]">
              <SimplePieChart
                value={deck.winRate}
                label="Win %"
                colours={{
                  "25": "#d84242",
                  "50": "#FA9F42",
                  "100": "#5abe8c",
                }}
              />
            </div>
          </Flex>
        </Flex>
        <Flex className="tags-container">
          <DeckTags deck={deck} />
        </Flex>
      </Flex>
    </div>
  );
}
