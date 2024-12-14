import { Spinner } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { DeckService } from "../services/Deck";
import { PlayerService } from "../services/Player";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbGame } from "../state/Game";
import { getItems } from "../utils/Firestore";
import { GamesTable } from "./GamesTable";

export function GamesViewer() {
  const { data, isLoading } = useQuery("getGames", () =>
    getItems<DbGame>(DatabaseTable.GAMES, "date")
  );
  const [populatingGames, setPopulatingGames] = useState<boolean>(false);
  const [games, setGames] = useState<DbGame[]>([]);

  const populateGames = useCallback(async () => {
    if (data) {
      setPopulatingGames(true);
      const populatedGames = [];
      for (let i = 0; i < data.length; i++) {
        const game = data[i];
        game.player1.playerObj = await PlayerService.getById(
          game.player1.player
        );
        game.player1.deckObj = await DeckService.getById(game.player1.deck);
        game.player2.playerObj = await PlayerService.getById(
          game.player2.player
        );
        game.player2.deckObj = await DeckService.getById(game.player2.deck);
        game.player3.playerObj = await PlayerService.getById(
          game.player3.player
        );
        game.player3.deckObj = await DeckService.getById(game.player3.deck);
        game.player4.playerObj = await PlayerService.getById(
          game.player4.player
        );
        game.player4.deckObj = await DeckService.getById(game.player4.deck);
        populatedGames.push(game);
      }
      setGames(populatedGames);
      setPopulatingGames(false);
    }
  }, [data]);

  useEffect(() => {
    if (!isLoading) {
      populateGames();
    }
  }, [isLoading, populateGames]);

  if (isLoading || populatingGames) {
    return <Spinner size="3" />;
  }

  return <GamesTable games={games} />;
}
