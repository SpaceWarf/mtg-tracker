import { Flex, Spinner } from "@radix-ui/themes";
import { useDecks } from "../hooks/useDecks";
import { useGames } from "../hooks/useGames";
import { DeckCreateModal } from "./DeckCreateModal";
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
      <Flex className="mb-5" justify="end" align="center">
        <DeckCreateModal />
      </Flex>
      <DecksCardView decks={dbDecks} games={dbGames} />
    </div>
  );
}
