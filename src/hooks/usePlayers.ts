import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { DataContext } from "../contexts/DataContext";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbPlayer } from "../state/Player";
import { getItems } from "../utils/Firestore";

export function usePlayers() {
  const currentData = useContext(DataContext);
  const { data: dbPlayers, isLoading: loadingPlayers } = useQuery(
    "getPlayers",
    () => getItems<DbPlayer>(DatabaseTable.PLAYERS),
    { enabled: !currentData?.players.length }
  );

  useEffect(() => {
    if (dbPlayers?.length) {
      currentData?.setPlayers(dbPlayers);
    }
  }, [dbPlayers, currentData]);

  return {
    dbPlayers,
    loadingPlayers,
  };
}
