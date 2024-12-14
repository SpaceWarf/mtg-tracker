import { Spinner } from "@radix-ui/themes";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { PlayersCardView } from "./PlayersCardView";

export function PlayersViewer() {
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbGames, loadingGames } = useGames();

  function loading(): boolean {
    return loadingGames || loadingPlayers;
  }

  if (loading() || !dbPlayers?.length || !dbGames?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="m-5 max-w-7xl">
      <PlayersCardView players={dbPlayers} games={dbGames} />
    </div>
  );
}
