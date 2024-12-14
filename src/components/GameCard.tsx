import { Card, Grid } from "@radix-ui/themes";
import { DbGame, GamePlayer } from "../state/Game";
import { GamePlayerSection } from "./GamePlayerSection";

type OwnProps = {
  game: DbGame;
};

export function GameCard({ game }: OwnProps) {
  const orderedPlayerNames = [
    game.player1.playerObj?.name ?? "",
    game.player2.playerObj?.name ?? "",
    game.player3.playerObj?.name ?? "",
    game.player4.playerObj?.name ?? "",
  ].sort();

  function getPlayerbyName(name: string): GamePlayer {
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
  }

  return (
    <Card style={{ flexBasis: "calc(50% - 12.5px)" }} size="3">
      <Grid columns="2" rows="2" width="auto" gap="5">
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[0])} />
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[1])} />
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[2])} />
        <GamePlayerSection player={getPlayerbyName(orderedPlayerNames[3])} />
      </Grid>
    </Card>
  );
}
