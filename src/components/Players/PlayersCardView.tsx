import { Grid } from "@radix-ui/themes";
import { useAuth } from "../../hooks/useAuth";
import { PlayerWithStats } from "../../state/Player";
import { PlayerCard2 } from "./PlayerCard2";

type OwnProps = {
  players: PlayerWithStats[];
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function PlayersCardView({ players }: OwnProps) {
  const auth = useAuth();

  return (
    <Grid columns={{ initial: "1", lg: "2", xl: "3" }} gap="5">
      {players.map((player) => (
        <div key={player.id}>
          <PlayerCard2 player={player} editable={!!auth.user} showActions />
        </div>
      ))}
    </Grid>
  );
}
