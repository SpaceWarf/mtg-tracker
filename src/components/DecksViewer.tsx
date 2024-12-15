import { Spinner } from "@radix-ui/themes";
import { useDecks } from "../hooks/useDecks";
import { useGames } from "../hooks/useGames";
import { DecksCardView } from "./DecksCardView";

export function DecksViewer() {
  const { dbDecks, loadingDecks } = useDecks();
  const { dbGames, loadingGames } = useGames();

  function loading(): boolean {
    return loadingGames || loadingDecks;
  }

  if (loading() || !dbDecks?.length || !dbGames?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="m-5 max-w-7xl">
      <DecksCardView decks={dbDecks} games={dbGames} />
    </div>
  );
}
