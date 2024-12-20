import { Card, Flex, Grid, Separator } from "@radix-ui/themes";
import { useCallback } from "react";
import { DbGame, GamePlayer } from "../../state/Game";
import { GameEditModal } from "./GameEditModal";
import { GamePlayerSection } from "./GamePlayerSection";

type OwnProps = {
  game: DbGame;
  editable?: boolean;
};

export function GameCard({ game, editable }: OwnProps) {
  const orderedPlayerNames = [
    game.player1.playerObj?.name ?? "",
    game.player2.playerObj?.name ?? "",
    game.player3.playerObj?.name ?? "",
    game.player4.playerObj?.name ?? "",
  ].sort();

  const getPlayerbyName = useCallback(
    (name: string): GamePlayer => {
      const player = [
        game.player1,
        game.player2,
        game.player3,
        game.player4,
      ].find((player) => player.playerObj?.name === name);

      if (!player) {
        throw new Error("Error: Could not find player.");
      }
      return player;
    },
    [game]
  );

  return (
    <Card size="3">
      {editable && (
        <Flex gap="3" className="absolute right-3 top-5" justify="end">
          <GameEditModal game={game} />
        </Flex>
      )}
      <Grid columns="2" rows="2" width="auto" gap="5">
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[0])} />
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[1])} />
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[2])} />
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[3])} />
      </Grid>
      {game.comments && (
        <>
          <Separator className="mt-5 mb-3" size="4" />
          <p>{game.comments}</p>
        </>
      )}
    </Card>
  );
}
