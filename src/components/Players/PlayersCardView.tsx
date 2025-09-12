import { Grid } from "@radix-ui/themes";
import { useAuth } from "../../hooks/useAuth";
import { PlayerWithStats } from "../../state/Player";
import { PlayerCard } from "./PlayerCard";

type OwnProps = {
  players: PlayerWithStats[];
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function PlayersCardView({ players }: OwnProps) {
  const auth = useAuth();

  return (
    <Grid columns={{ initial: "1", sm: "2", lg: "3", xl: "4" }} gap="5">
      {players.map((player) => (
        <div key={player.id}>
          <PlayerCard player={player} editable={!!auth.user} showActions />
        </div>
      ))}
    </Grid>
  );
}
