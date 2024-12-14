import { Flex, Spinner, Switch, Text } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { DeckService } from "../services/Deck";
import { PlayerService } from "../services/Player";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbGame } from "../state/Game";
import { GameViewType } from "../state/GameViewType";
import { getItems } from "../utils/Firestore";
import { GamesCardView } from "./GamesCardView";
import { GamesTableView } from "./GamesTableView";

export function GamesViewer() {
  const { data, isLoading } = useQuery("getGames", () =>
    getItems<DbGame>(DatabaseTable.GAMES, "date")
  );
  const [populatingGames, setPopulatingGames] = useState<boolean>(true);
  const [games, setGames] = useState<DbGame[]>([]);
  const [viewType, setViewType] = useState<GameViewType>(GameViewType.CARDS);

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

  if (isLoading || populatingGames || !data?.length) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="m-5 max-w-7xl">
      <Flex className="mb-5">
        <Text as="label" size="2">
          <Flex gap="2">
            Table
            <Switch
              size="2"
              checked={viewType === GameViewType.CARDS}
              onClick={() =>
                setViewType(
                  viewType === GameViewType.CARDS
                    ? GameViewType.TABLE
                    : GameViewType.CARDS
                )
              }
            />
            Cards
          </Flex>
        </Text>
      </Flex>
      {viewType === GameViewType.CARDS && <GamesCardView games={games} />}
      {viewType === GameViewType.TABLE && <GamesTableView games={games} />}
    </div>
  );
}
