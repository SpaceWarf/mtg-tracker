import { useEffect, useMemo, useState } from "react";
import { PlayerWithStats } from "../state/Player";
import { populatePlayer } from "../utils/Player";
import { useGames } from "./useGames";
import { usePlayers } from "./usePlayers";

export function usePopulatedPlayers() {
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbGames, loadingGames } = useGames();
  const [populated, setPopulated] = useState(false);
  const [populatedPlayers, setPopulatedPlayers] = useState<PlayerWithStats[]>(
    []
  );

  const populating = useMemo(() => {
    return loadingPlayers || loadingGames || !populated;
  }, [loadingPlayers, loadingGames, populated]);

  useEffect(() => {
    setPopulated(false);
    let populatedPlayers: PlayerWithStats[] = [];

    if (dbPlayers && dbGames) {
      populatedPlayers = dbPlayers.map((player) =>
        populatePlayer(player, dbGames)
      );
    }

    setPopulatedPlayers(populatedPlayers);
    setPopulated(true);
  }, [dbPlayers, dbGames]);

  return {
    populatedPlayers,
    populating,
  };
}
