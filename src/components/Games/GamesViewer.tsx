import { Flex, Heading, Spinner, Switch, Text } from "@radix-ui/themes";
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
import { GAME_SORT_FCTS, getGameSortFctName } from "../../state/GameSortFcts";
import { GameViewType } from "../../state/GameViewType";
import { DbPlayer } from "../../state/Player";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import {
  gameHasAllDecks,
  gameHasAllPlayers,
  gameHasSomeDecks,
  gameHasSomePlayers,
} from "../../utils/Game";
import { DeckSelect } from "../Select/DeckSelect";
import { PlayerSelect } from "../Select/PlayerSelect";
import { SortFctSelect } from "../Select/SortFctSelect";
import { GameCreateModal } from "./GameCreateModal";
import { GamesCardView } from "./GamesCardView";
import { GamesTableView } from "./GamesTableView";

export function GamesViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewType, setViewType] = useState<GameViewType>(GameViewType.CARDS);
  const [sortFctKey, setSortFctKey] = useState<SelectOption>({
    value: GameSortFctKey.DATE_DESC,
    label: getGameSortFctName(GameSortFctKey.DATE_DESC),
  });

  const { dbGames, loadingGames } = useGames();
  const [populatingGames, setPopulatingGames] = useState<boolean>(true);
  const [populatedGames, setPopulatedGames] = useState<DbGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<DbGame[]>([]);

  const { dbPlayers, loadingPlayers } = usePlayers();
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>([]);
  const [excludedPlayers, setExcludedPlayers] = useState<string[]>([]);

  const { dbDecks, loadingDecks } = useDecks();
  const [visibleDecks, setVisibleDecks] = useState<string[]>([]);
  const [excludedDecks, setExcludedDecks] = useState<string[]>([]);

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
      const hasVisiblePlayers = gameHasAllPlayers(game, visiblePlayers);
      const hasExcludedPlayers = gameHasSomePlayers(game, excludedPlayers);
      const hasVisibleDecks = gameHasAllDecks(game, visibleDecks);
      const hasExcludedDecks = gameHasSomeDecks(game, excludedDecks);

      return (
        hasVisiblePlayers &&
        !hasExcludedPlayers &&
        hasVisibleDecks &&
        !hasExcludedDecks
      );
    });
    const sortFct = GAME_SORT_FCTS[sortFctKey.value].sortFct;
    const sorted = cloneDeep(filtered).sort(sortFct);
    setFilteredGames(sorted);
  }, [
    populatedGames,
    sortFctKey,
    visiblePlayers,
    excludedPlayers,
    visibleDecks,
    excludedDecks,
  ]);

  useEffect(() => {
    const urlSortKey = searchParams.get("sort");
    if (
      urlSortKey &&
      Object.values<string>(GameSortFctKey).includes(urlSortKey)
    ) {
      setSortFctKey({
        value: urlSortKey as GameSortFctKey,
        label: getGameSortFctName(urlSortKey as GameSortFctKey),
      });
    }
  }, [searchParams]);

  function loading(): boolean {
    return loadingGames || loadingPlayers || loadingDecks || populatingGames;
  }

  function handleSort(value: string) {
    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  if (loading()) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full max-w-[1750px]">
      <Flex className="mb-5" justify="between">
        <Flex gap="5" wrap="wrap">
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
            <SortFctSelect
              type={SortFctType.GAME}
              value={sortFctKey.value}
              onChange={handleSort}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Include players
            </Heading>
            <PlayerSelect
              value={visiblePlayers}
              onChange={setVisiblePlayers}
              isMulti
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Exclude players
            </Heading>
            <PlayerSelect
              value={excludedPlayers}
              onChange={setExcludedPlayers}
              isMulti
            />
          </div>
          <div className="max-w-96">
            <Heading className="mb-1" size="3">
              Include decks
            </Heading>
            <DeckSelect
              value={visibleDecks}
              onChange={setVisibleDecks}
              isMulti
            />
          </div>
          <div className="max-w-96">
            <Heading className="mb-1" size="3">
              Exclude decks
            </Heading>
            <DeckSelect
              value={excludedDecks}
              onChange={setExcludedDecks}
              isMulti
            />
          </div>
        </Flex>
        <Flex className="w-60" justify="end">
          <div>{auth.user && <GameCreateModal />}</div>
        </Flex>
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
