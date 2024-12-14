import { Flex } from "@radix-ui/themes";
import { DbGame } from "../state/Game";
import { GameCard } from "./GameCard";

type OwnProps = {
  games: DbGame[];
};

export function GamesCardView({ games }: OwnProps) {
  return (
    <Flex flexGrow="1" gap="25px" wrap="wrap" justify="center">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </Flex>
  );
}
