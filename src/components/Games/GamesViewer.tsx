import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  CheckboxCards,
  Flex,
  Heading,
  Select,
  Spinner,
  Switch,
  Text,
} from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { GameSortFctKey } from "../../state/GameSortFctKey";
import { GAME_SORT_FCTS } from "../../state/GameSortFcts";
import { GameViewType } from "../../state/GameViewType";
import { DbPlayer } from "../../state/Player";
import { GameCreateModal } from "./GameCreateModal";
import { GamesCardView } from "./GamesCardView";
import { GamesTableView } from "./GamesTableView";

export function GamesViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbGames, loadingGames } = useGames();
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbDecks, loadingDecks } = useDecks();
  const [populatingGames, setPopulatingGames] = useState<boolean>(true);
  const [populatedGames, setPopulatedGames] = useState<DbGame[]>([]);
  const [viewType, setViewType] = useState<GameViewType>(GameViewType.CARDS);
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>([]);
  const [sortFctKey, setSortFctKey] = useState<GameSortFctKey>(
    GameSortFctKey.DATE_DESC
  );
  const [filteredGames, setFilteredGames] = useState<DbGame[]>([]);

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
      setPopulatedGames(populated.sort((a, b) => b.date.localeCompare(a.date)));
      setPopulatingGames(false);
    }
  }, [dbGames, getDeckByIdFromContext, getPlayerByIdFromContext]);

  useEffect(() => {
    if (!loadingGames && !loadingDecks && !loadingPlayers) {
      populateGames();
    }
  }, [loadingGames, loadingDecks, loadingPlayers, populateGames]);

  useEffect(() => {
    const filtered = cloneDeep(populatedGames).filter((game) => {
      if (visiblePlayers.length) {
        const gamePlayers = [
          game.player1.player,
          game.player2.player,
          game.player3.player,
          game.player4.player,
        ];
        return visiblePlayers.every((visiblePlayer) =>
          gamePlayers.includes(visiblePlayer)
        );
      }
      return game;
    });
    const sortFct = GAME_SORT_FCTS[sortFctKey].sortFct;
    const sorted = cloneDeep(filtered).sort(sortFct);
    setFilteredGames(sorted);
  }, [populatedGames, sortFctKey, visiblePlayers]);

  useEffect(() => {
    const urlSortKey = searchParams.get("sort");
    if (
      urlSortKey &&
      Object.values<string>(GameSortFctKey).includes(urlSortKey)
    ) {
      setSortFctKey(urlSortKey as GameSortFctKey);
    }
  }, [searchParams]);

  function loading(): boolean {
    return loadingGames || loadingPlayers || loadingDecks || populatingGames;
  }

  function handleSort(sortKey: GameSortFctKey) {
    setSearchParams({
      sort: sortKey,
    });
  }

  function handleVisiblePlayerToggle(id: string) {
    if (visiblePlayers.includes(id)) {
      setVisiblePlayers(visiblePlayers.filter((player) => player !== id));
    } else {
      setVisiblePlayers([...visiblePlayers, id]);
    }
  }

  if (loading()) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full" style={{ maxWidth: "1750px" }}>
      <Flex className="mb-5" justify="between" align="end">
        <Flex gap="5">
          <div>
            <Heading className="mb-2" size="3">
              View type
            </Heading>
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
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Sort by
            </Heading>
            <Select.Root
              value={sortFctKey}
              onValueChange={(value) => handleSort(value as GameSortFctKey)}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  {Object.values(GameSortFctKey).map((key) => (
                    <Select.Item key={key} value={key}>
                      {GAME_SORT_FCTS[key].name}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Include players
            </Heading>
            <CheckboxCards.Root
              value={visiblePlayers}
              columns={{ initial: "1", sm: "5" }}
              size="1"
            >
              {dbPlayers?.map((player) => (
                <CheckboxCards.Item
                  key={player.id}
                  value={player.id}
                  onClick={() => handleVisiblePlayerToggle(player.id)}
                >
                  <Flex gap="2" align="center" width="100%">
                    <Avatar
                      className="mt-1"
                      src={`/img/pfp/${player.id}.webp`}
                      fallback={<FontAwesomeIcon icon={faUser} />}
                      radius="full"
                      size="1"
                    />
                    <Text>{player.name}</Text>
                  </Flex>
                </CheckboxCards.Item>
              ))}
            </CheckboxCards.Root>
          </div>
        </Flex>
        <div>{auth.user && <GameCreateModal />}</div>
      </Flex>

      {filteredGames.length ? (
        <>
          {viewType === GameViewType.CARDS && (
            <GamesCardView games={filteredGames} />
          )}
          {viewType === GameViewType.TABLE && (
            <GamesTableView games={filteredGames} />
          )}
        </>
      ) : (
        <div>No results for applied filters.</div>
      )}
    </div>
  );
}
