import { Flex, Spinner, Switch, Text } from "@radix-ui/themes";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { DataContext } from "../contexts/DataContext";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck } from "../state/Deck";
import { DbGame } from "../state/Game";
import { GameViewType } from "../state/GameViewType";
import { DbPlayer } from "../state/Player";
import { getItems } from "../utils/Firestore";
import { GamesCardView } from "./GamesCardView";
import { GamesTableView } from "./GamesTableView";

export function GamesViewer() {
  const currentData = useContext(DataContext);
  const { data: dbGames, isLoading: loadingGames } = useQuery(
    "getGames",
    () => getItems<DbGame>(DatabaseTable.GAMES, "date"),
    { enabled: !currentData?.games.length }
  );
  const { data: dbPlayers, isLoading: loadingPlayers } = useQuery(
    "getPlayers",
    () => getItems<DbPlayer>(DatabaseTable.PLAYERS),
    { enabled: !currentData?.players.length }
  );
  const { data: dbDecks, isLoading: loadingDecks } = useQuery(
    "getDecks",
    () => getItems<DbDeck>(DatabaseTable.DECKS),
    { enabled: !currentData?.decks.length }
  );
  const [populatingGames, setPopulatingGames] = useState<boolean>(true);
  const [populatedGames, setPopulatedGames] = useState<DbGame[]>([]);
  const [viewType, setViewType] = useState<GameViewType>(GameViewType.CARDS);

  const getPlayerByIdFromContext = useCallback(
    (id: string): DbPlayer | undefined => {
      return dbPlayers?.find((player) => player.id === id) ?? undefined;
    },
    [dbPlayers]
  );

  const getDeckByIdFromContext = useCallback(
    (id: string): DbDeck | undefined => {
      return dbDecks?.find((deck) => deck.id === id) ?? undefined;
    },
    [dbDecks]
  );

  const populateGames = useCallback(async () => {
    if (dbGames) {
      setPopulatingGames(true);
      const populated = [];
      for (let i = 0; i < dbGames.length; i++) {
        const game = dbGames[i];
        game.player1.playerObj = getPlayerByIdFromContext(game.player1.player);
        game.player1.deckObj = getDeckByIdFromContext(game.player1.deck);
        game.player2.playerObj = getPlayerByIdFromContext(game.player2.player);
        game.player2.deckObj = getDeckByIdFromContext(game.player2.deck);
        game.player3.playerObj = getPlayerByIdFromContext(game.player3.player);
        game.player3.deckObj = getDeckByIdFromContext(game.player3.deck);
        game.player4.playerObj = getPlayerByIdFromContext(game.player4.player);
        game.player4.deckObj = getDeckByIdFromContext(game.player4.deck);
        populated.push(game);
      }
      setPopulatedGames(populated);
      setPopulatingGames(false);
    }
  }, [dbGames, getDeckByIdFromContext, getPlayerByIdFromContext]);

  useEffect(() => {
    if (!loadingGames) {
      populateGames();
    }
  }, [loadingGames, populateGames]);

  useEffect(() => {
    if (dbGames?.length) {
      currentData?.setGames(dbGames);
    }
  }, [dbGames, currentData]);

  useEffect(() => {
    if (dbPlayers?.length) {
      currentData?.setPlayers(dbPlayers);
    }
  }, [dbPlayers, currentData]);

  useEffect(() => {
    if (dbDecks?.length) {
      currentData?.setDecks(dbDecks);
    }
  }, [dbDecks, currentData]);

  function loading(): boolean {
    return loadingGames || loadingPlayers || loadingDecks || populatingGames;
  }

  if (loading()) {
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
      {viewType === GameViewType.CARDS && (
        <GamesCardView games={populatedGames} />
      )}
      {viewType === GameViewType.TABLE && (
        <GamesTableView games={populatedGames} />
      )}
    </div>
  );
}
