import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { DataContext } from "../contexts/DataContext";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbGame } from "../state/Game";
import { getItems } from "../utils/Firestore";

export function useGames() {
  const currentData = useContext(DataContext);
  const { data: dbGames, isLoading: loadingGames } = useQuery(
    "getGames",
    () => getItems<DbGame>(DatabaseTable.GAMES, "date"),
    { enabled: !currentData?.games.length }
  );

  useEffect(() => {
    if (dbGames?.length) {
      currentData?.setGames(dbGames);
    }
  }, [dbGames, currentData]);

  return {
    dbGames,
    loadingGames,
  };
}
