import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { DataContext } from "../contexts/DataContext";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck } from "../state/Deck";
import { getItems } from "../utils/Firestore";

export function useDecks() {
  const currentData = useContext(DataContext);
  const { data: dbDecks, isLoading: loadingDecks } = useQuery(
    "getDecks",
    () => getItems<DbDeck>(DatabaseTable.DECKS),
    { enabled: !currentData?.decks.length }
  );

  useEffect(() => {
    if (dbDecks?.length) {
      currentData?.setDecks(dbDecks);
    }
  }, [dbDecks, currentData]);

  return {
    dbDecks,
    loadingDecks,
  };
}
