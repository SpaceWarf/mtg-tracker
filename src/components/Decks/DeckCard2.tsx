import { faCrown, faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Tooltip } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import "../../assets/styles/DeckCard.scss";
import { DeckWithStats } from "../../state/Deck";
import { WinRatePieChart } from "../Common/WinRatePieChart";
import { DeckHeader2 } from "./DeckHeader2";
import { DeckTags } from "./DeckTags";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
};

export function DeckCard2({ deck, editable = false }: OwnProps) {
  const navigate = useNavigate();

  return (
    <div
      className="deck-card mt-2"
      style={
        {
          ["--url" as string]: `url(${deck.featured})`,
        } as React.CSSProperties
      }
      onClick={() => navigate(`/decks/${deck.id}`)}
    >
      <Flex className="h-full" direction="column" justify="between">
        <Flex className="content-container" direction="column" gap="3">
          <DeckHeader2 deck={deck} editable={editable} showActions />
          <Flex justify="between">
            <Flex mt="2" gap="4">
              <Tooltip content="Games Played">
                <Flex className="games-played-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faDice} />
                  <p>{deck.gamesPlayed}</p>
                </Flex>
              </Tooltip>
              <Tooltip content="Games Won">
                <Flex className="games-won-container" gap="2">
                  <FontAwesomeIcon size="xl" icon={faCrown} />
                  <p>{deck.winCount}</p>
                </Flex>
              </Tooltip>
            </Flex>
            <div className="win-percent-container mt-[-20px]">
              <WinRatePieChart deck={deck} />
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
