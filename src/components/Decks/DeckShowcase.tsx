import {
  faBaseballBatBall,
  faCalendarDays,
  faCalendarPlus,
  faCrown,
  faDice,
  faDollarSign,
  faEye,
  faFaceAngry,
  faLayerGroup,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import "../../assets/styles/DeckShowcase.scss";
import { DeckWithStats } from "../../state/Deck";
import { CARD_COUNT } from "../../utils/Bracket";
import { getLongDateString } from "../../utils/Date";
import { getDeckCommanders } from "../../utils/Deck";
import { CardPreview } from "../Cards/CardPreview";
import { DeckHeader2 } from "./DeckHeader2";
import { DeckTags } from "./DeckTags";

type OwnProps = {
  deck: DeckWithStats;
  showStats?: boolean;
};

export function DeckShowcase({ deck, showStats }: OwnProps) {
  const commanders = useMemo(() => {
    return getDeckCommanders(deck);
  }, [deck]);

  return (
    <div className="deck-showcase">
      <Flex
        className="header"
        direction="column"
        style={
          {
            ["--url" as string]: `url(${deck.featured})`,
          } as React.CSSProperties
        }
      >
        <DeckHeader2 deck={deck} />
        <Flex justify="center">
          <CardPreview cards={commanders} clickable />
        </Flex>
        <DeckTags deck={deck} />
      </Flex>
      <Flex direction="column" className="stats-table">
        {showStats && (
          <>
            <Flex className="stats-row" justify="between" flexGrow="1">
              <Flex className="label" align="center" gap="2">
                <FontAwesomeIcon size="xl" width="22" icon={faDice} />
                <p>Games Played</p>
              </Flex>
              <p className="value">{deck.gamesPlayed}</p>
            </Flex>
            <Flex className="stats-row" justify="between" flexGrow="1">
              <Flex className="label" align="center" gap="2">
                <FontAwesomeIcon size="xl" width="22" icon={faCrown} />
                <p>Games Won</p>
              </Flex>
              <p className="value">{deck.winCount}</p>
            </Flex>
            <Flex className="stats-row" justify="between" flexGrow="1">
              <Flex className="label" align="center" gap="2">
                <FontAwesomeIcon
                  size="xl"
                  width="22"
                  icon={faBaseballBatBall}
                />
                <p>Grand Slams</p>
              </Flex>
              <p className="value">{deck.grandSlamCount}</p>
            </Flex>
          </>
        )}
        <Flex
          className={`stats-row ${
            parseInt(deck.size ?? "0") !== CARD_COUNT ? "error" : ""
          }`}
          justify="between"
          flexGrow="1"
        >
          <Flex className="label" align="center" gap="2">
            <FontAwesomeIcon size="xl" width="22" icon={faLayerGroup} />
            <p>Size</p>
          </Flex>
          <p className="value">{deck.size ?? "-"}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <FontAwesomeIcon size="xl" width="22" icon={faDollarSign} />
            <p>Est. Price</p>
          </Flex>
          <p className="value">{deck.price ?? "-"}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <FontAwesomeIcon size="xl" width="22" icon={faFaceAngry} />
            <p>Salt Sum</p>
          </Flex>
          <p className="value">{deck.saltSum ?? "-"}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <FontAwesomeIcon size="xl" width="22" icon={faEye} />
            <p>View Count</p>
          </Flex>
          <p className="value">{deck.viewCount ?? "-"}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <FontAwesomeIcon size="xl" width="22" icon={faCalendarDays} />
            <p>Created At</p>
          </Flex>
          <p className="value">{getLongDateString(deck.deckCreatedAt ?? "")}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <FontAwesomeIcon size="xl" width="22" icon={faCalendarPlus} />
            <p>Updated At</p>
          </Flex>
          <p className="value">{getLongDateString(deck.deckUpdatedAt ?? "")}</p>
        </Flex>
        <Flex className="stats-row" justify="between" flexGrow="1">
          <Flex className="label" align="center" gap="2">
            <FontAwesomeIcon size="xl" width="22" icon={faRotate} />
            <p>Last Synced At</p>
          </Flex>
          <p className="value">{getLongDateString(deck.updatedAt ?? "")}</p>
        </Flex>
      </Flex>
    </div>
  );
}
