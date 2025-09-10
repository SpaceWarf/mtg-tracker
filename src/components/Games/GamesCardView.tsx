import { Grid, Heading } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
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
      const entry = map.get(game.date);
      if (entry) {
        map.set(game.date, [...entry, game]);
      } else {
        map.set(game.date, [game]);
      }
    });
    setDateMap(map);
  }, []);

  useEffect(() => {
    populateDateMap(games);
  }, [games, populateDateMap]);

  return Array.from(dateMap.entries()).map(([date, gamesForDate]) => (
    <div key={date}>
      <Heading className="mb-5 mt-5 pb-2 border-b">
        {getLongDateString(date)}
      </Heading>
      <Grid columns={{ initial: "1", md: "2", xl: "3" }} gap="5">
        {gamesForDate.map((game) => (
          <GameCard2 key={game.id} game={game} editable={!!auth.user} />
        ))}
      </Grid>
    </div>
  ));
}
