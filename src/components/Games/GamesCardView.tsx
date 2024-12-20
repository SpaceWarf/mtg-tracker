import { Flex, Heading } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { DbGame } from "../../state/Game";
import { getLongDateString } from "../../utils/Date";
import { GameCard } from "./GameCard";

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
      <Heading className="mb-5 pb-2 border-b">
        {getLongDateString(date)}
      </Heading>
      <Flex className="mb-10" flexGrow="1" gap="25px" wrap="wrap">
        {gamesForDate.map((game) => (
          <div key={game.id} style={{ flexBasis: "calc(33.33% - 16.66px)" }}>
            <GameCard key={game.id} game={game} editable={!!auth.user} />
          </div>
        ))}
      </Flex>
    </div>
  ));
}
