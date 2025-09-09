import { faCrown, faDice, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Flex, Tooltip } from "@radix-ui/themes";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import "../../assets/styles/PlayerPreview.scss";
import { usePlayers } from "../../hooks/usePlayers";

type OwnProps = {
  player: string;
  won: number;
  lost: number;
  good?: boolean;
};

export function PlayerPreview({ player, won, lost, good }: OwnProps) {
  const navigate = useNavigate();
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
    <Box maxWidth="200px" flexGrow="1">
      <div
        className="player-preview item-card selectable"
        style={
          {
            ["--url" as string]: `url(/img/pfp/${player}.webp)`,
          } as React.CSSProperties
        }
        onClick={() => navigate(`/players/${player}`)}
      >
        <Flex className="h-full" direction="column" gap="2">
          <p className="name">{playerData?.name}</p>
          <Flex className="h-full" align="center" justify="center">
            <Flex className="stats" align="center" justify="center" wrap="wrap">
              <Tooltip content="Games Played">
                <Flex
                  gap="1"
                  justify="center"
                  align="center"
                  width="50%"
                  height="50px"
                >
                  <FontAwesomeIcon icon={faDice} />
                  <p>{won + lost}</p>
                </Flex>
              </Tooltip>
              <Tooltip content={good ? "Games Won" : "Games Lost"}>
                <Flex
                  gap="1"
                  justify="center"
                  align="center"
                  width="50%"
                  height="50px"
                >
                  <FontAwesomeIcon
                    icon={faCrown}
                    color={good ? "#5abe8c" : "#d84242"}
                  />
                  <p>{good ? won : lost}</p>
                </Flex>
              </Tooltip>
              <Tooltip content="Win Rate">
                <Flex
                  gap="1"
                  justify="center"
                  align="center"
                  width="50%"
                  height="50px"
                >
                  <FontAwesomeIcon icon={faPercent} />
                  <p>{winRate.toFixed(0)}%</p>
                </Flex>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </Box>
  );
}
