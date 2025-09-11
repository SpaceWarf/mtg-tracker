import { Box, Flex } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import "../../assets/styles/GamePlayerPreview.scss";
import { GamePlayer } from "../../state/Game";
import { DeckColourIdentity } from "../Decks/DeckColourIdentity";
import { GameStartIcon } from "../Icons/GameStartIcon";
import { GameWonIcon } from "../Icons/GameWonIcon";
import { SolRingIcon } from "../Icons/SolRingIcon";

type OwnProps = {
  player: GamePlayer;
};

export function GamePlayerPreview({ player }: OwnProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

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

  function handlePlayerClick() {
    window.open(`/players/${player.player}`, "_blank");
  }

  function handleDeckClick(version: string) {
    window.open(`/decks/${player.deck}?version=${version}`, "_blank");
  }

  if (!player.playerObj || !player.deckObj) {
    return null;
  }

  const playerStyle = {
    ["--player-url" as string]: `url(/img/pfp/${player.playerObj.id}.webp)`,
  } as React.CSSProperties;

  const deckStyle = {
    ["--deck-url" as string]: `url(${player.deckObj.featured})`,
  } as React.CSSProperties;

  const versionIdx =
    player.deckObj.versions?.findIndex((v) => v.id === player.deckVersion) ??
    -1;
  const nextVersion = player.deckObj.versions?.[versionIdx + 1]?.id;

  return (
    <Box className="game-player-preview" ref={elRef}>
      <Flex
        className="player"
        style={playerStyle}
        align="center"
        justify="center"
        gap="2"
        onClick={handlePlayerClick}
      >
        <p>{player.playerObj.name}</p>
        <Flex gap="2">
          {player.won && <GameWonIcon />}
          {player.t1SolRing && <SolRingIcon />}
          {player.started && <GameStartIcon />}
        </Flex>
      </Flex>
      <Box className="playing-label">
        <p>playing</p>
      </Box>
      <Flex
        className="deck"
        style={deckStyle}
        direction="column"
        align="center"
        justify="center"
        onClick={() => handleDeckClick(nextVersion ?? "latest")}
      >
        <Flex align="center" gap="1" wrap="wrap">
          <p className="deck-name" style={{ maxWidth: `${width - 50}px` }}>
            {player.deckObj.name}
          </p>
          <p className="deck-version">
            v{versionIdx === -1 ? "1" : `${versionIdx + 2}`}
          </p>
        </Flex>
        <p className="deck-commander" style={{ maxWidth: `${width - 25}px` }}>
          {player.deckObj.commander}
        </p>
        {player.deckObj.externalId && (
          <DeckColourIdentity deck={player.deckObj} size="small" />
        )}
      </Flex>
    </Box>
  );
}
