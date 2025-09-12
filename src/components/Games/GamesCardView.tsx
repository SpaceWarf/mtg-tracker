import { Grid } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import "../../assets/styles/GamesCardView.scss";
import { useAuth } from "../../hooks/useAuth";
import { DbGame } from "../../state/Game";
import { getLongDateString } from "../../utils/Date";
import { GameCard2 } from "./GameCard2";

type OwnProps = {
  games: DbGame[];
};

export function GamesCardView({ games }: OwnProps) {
  const auth = useAuth();
  const [dateMap, setDateMap] = useState<Map<string, DbGame[]>>(new Map());

  const populateDateMap = useCallback((games: DbGame[]) => {
    const map = new Map<string, DbGame[]>();
    games.forEach((game) => {
      const dateObj = new Date(game.date);
      const dateKey = dateObj.toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const entry = map.get(dateKey);
      if (entry) {
        map.set(dateKey, [...entry, game]);
      } else {
        map.set(dateKey, [game]);
      }
    });
    setDateMap(map);
  }, []);

  useEffect(() => {
    populateDateMap(games);
  }, [games, populateDateMap]);

  return (
    <div className="games-card-view">
      {Array.from(dateMap.entries()).map(([date, gamesForDate]) => (
        <div key={date}>
          <p className="date-label mb-5 mt-5">{getLongDateString(date)}</p>
          <Grid columns={{ initial: "1", md: "2", xl: "3" }} gap="5">
            {gamesForDate.map((game, index) => (
              <GameCard2
                key={game.id}
                game={game}
                index={index}
                editable={!!auth.user}
              />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}
