import { useEffect, useMemo, useState } from "react";
import { PlayerWithStats } from "../state/Player";
import { populatePlayer } from "../utils/Player";
import { useDecks } from "./useDecks";
import { useGames } from "./useGames";
import { usePlayers } from "./usePlayers";

export function usePopulatedPlayers() {
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbGames, loadingGames } = useGames();
  const { dbDecks, loadingDecks } = useDecks();

  const [populated, setPopulated] = useState(false);
  const [populatedPlayers, setPopulatedPlayers] = useState<PlayerWithStats[]>(
    []
  );

  const populating = useMemo(() => {
    return loadingPlayers || loadingGames || loadingDecks || !populated;
  }, [loadingPlayers, loadingGames, loadingDecks, populated]);

  useEffect(() => {
    setPopulated(false);
    let populatedPlayers: PlayerWithStats[] = [];

    if (dbPlayers && dbGames && dbDecks) {
      populatedPlayers = dbPlayers.map((player) =>
        populatePlayer(player, dbGames, dbDecks)
      );
    }

    setPopulatedPlayers(populatedPlayers);
    setPopulated(true);
  }, [dbPlayers, dbGames, dbDecks]);

  return {
    populatedPlayers,
    populating,
  };
}
