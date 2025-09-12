import { Box, Flex, Grid, Tooltip } from "@radix-ui/themes";
import { useMemo } from "react";
import "../../assets/styles/PlayerPreview.scss";
import { usePlayers } from "../../hooks/usePlayers";
import { Icon } from "../Common/Icon";

type OwnProps = {
  player: string;
  won: number;
  lost: number;
  good?: boolean;
};

export function PlayerPreview({ player, won, lost, good }: OwnProps) {
  const { dbPlayers, loadingPlayers } = usePlayers();

  const playerData = useMemo(() => {
    return dbPlayers?.find((dbPlayer) => dbPlayer.id === player);
  }, [dbPlayers, player]);

  const gamesPlayed = won + lost;
  const winRate = gamesPlayed > 0 ? (won / gamesPlayed) * 100 : 0;

  if (loadingPlayers || !playerData) {
    return null;
  }

  return (
    <div
      className="player-preview item-card selectable"
      style={
        {
          ["--url" as string]: `url(/img/pfp/${player}.webp)`,
        } as React.CSSProperties
      }
      onClick={() => window.open(`/players/${player}`, "_blank")}
    >
      <Flex className="h-full" direction="column" gap="2">
        <p className="name">{playerData?.name}</p>
        <Flex className="h-full" align="center" justify="center">
          <Grid columns="2" className="stats" gapX="5">
            <Tooltip content="Games Played">
              <Flex gap="1" justify="center" align="center" height="50px">
                <Icon icon="dice" />
                <p>{won + lost}</p>
              </Flex>
            </Tooltip>
            <Tooltip content={good ? "Games Won" : "Games Lost"}>
              <Flex gap="1" justify="center" align="center" height="50px">
                <Icon icon="crown" color={good ? "#5abe8c" : "#d84242"} />
                <p>{good ? won : lost}</p>
              </Flex>
            </Tooltip>
            <Box gridColumn="span 2">
              <Tooltip content="Win Rate">
                <Flex gap="1" justify="center" align="center" height="50px">
                  <Icon icon="percent" type="regular" />
                  <p>{winRate.toFixed(0)}%</p>
                </Flex>
              </Tooltip>
            </Box>
          </Grid>
        </Flex>
      </Flex>
    </div>
  );
}
