import { faCrown, faDice, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Tooltip } from "@radix-ui/themes";
import { useEffect, useMemo, useRef, useState } from "react";
import "../../assets/styles/CommanderPreview.scss";
import { useDecks } from "../../hooks/useDecks";
import { getDeckCommanders } from "../../utils/Deck";
import { CardPreview } from "../Cards/CardPreview";

type OwnProps = {
  deck: string;
  won: number;
  lost: number;
  good?: boolean;
};

export function CommanderPreview({ deck, won, lost, good }: OwnProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const { dbDecks, loadingDecks } = useDecks();
  const [width, setWidth] = useState(0);

  const deckData = useMemo(() => {
    return dbDecks?.find((dbDeck) => dbDeck.id === deck);
  }, [dbDecks, deck]);

  const commanders = useMemo(() => {
    if (!deckData) {
      return [];
    }
    return getDeckCommanders(deckData);
  }, [deckData]);

  useEffect(() => {
    if (!elRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setWidth(width);
      }
    });
    observer.observe(elRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const gamesPlayed = won + lost;
  const winRate = gamesPlayed > 0 ? (won / gamesPlayed) * 100 : 0;

  if (loadingDecks || !deckData) {
    return null;
  }

  return (
    <Flex
      key={deck}
      ref={elRef}
      className="commander-preview item-card selectable"
      direction="column"
      align="center"
      gap="2"
      style={
        {
          ["--url" as string]: `url(${deckData.featured})`,
        } as React.CSSProperties
      }
      onClick={() => window.open(`/decks/${deck}`, "_blank")}
    >
      <p className="name mb-1" style={{ maxWidth: `${width}px` }}>
        {deckData?.name}
      </p>
      <Flex className="stats" gap="3" justify="center">
        <Tooltip content="Games Played">
          <Flex gap="1">
            <FontAwesomeIcon icon={faDice} />
            <p>{won + lost}</p>
          </Flex>
        </Tooltip>
        <Tooltip content={good ? "Games Won" : "Games Lost"}>
          <Flex gap="1">
            <FontAwesomeIcon
              icon={faCrown}
              color={good ? "#5abe8c" : "#d84242"}
            />
            <p>{good ? won : lost}</p>
          </Flex>
        </Tooltip>
        <Tooltip content="Win Rate">
          <Flex gap="1">
            <FontAwesomeIcon icon={faPercent} />
            <p>{winRate.toFixed(0)}%</p>
          </Flex>
        </Tooltip>
      </Flex>
      <CardPreview cards={commanders} size="small" />
    </Flex>
  );
}
