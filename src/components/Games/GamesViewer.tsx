import { Flex, Heading, Spinner, Switch, Text } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { GameSortFctKey } from "../../state/GameSortFctKey";
import { GAME_SORT_FCTS, getSortFctName } from "../../state/GameSortFcts";
import { GameViewType } from "../../state/GameViewType";
import { DbPlayer } from "../../state/Player";
import { SelectOption } from "../../state/SelectOption";
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
  const [visiblePlayers, setVisiblePlayers] = useState<
    MultiValue<SelectOption>
  >([]);
  const [excludedPlayers, setExcludedPlayers] = useState<
    MultiValue<SelectOption>
  >([]);
  const [sortFctKey, setSortFctKey] = useState<SelectOption>({
    value: GameSortFctKey.DATE_DESC,
    label: getSortFctName(GameSortFctKey.DATE_DESC),
  });
  const [filteredGames, setFilteredGames] = useState<DbGame[]>([]);
  const playerSelectOptions = useSelectOptions(dbPlayers ?? [], "id", "name");

  const sortFctOptions = useMemo(() => {
    return Object.values(GameSortFctKey).map((key) => ({
      value: key,
      label: getSortFctName(key),
    }));
  }, []);

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
      const gamePlayers = [
        game.player1.player,
        game.player2.player,
        game.player3.player,
        game.player4.player,
      ];
      const hasVisiblePlayers = visiblePlayers.length
        ? visiblePlayers.every((visiblePlayer) =>
            gamePlayers.includes(visiblePlayer.value)
          )
        : true;
      const hasExcludedPlayers = excludedPlayers.length
        ? excludedPlayers.some((excludedPlayer) =>
            gamePlayers.includes(excludedPlayer.value)
          )
        : false;
      return hasVisiblePlayers && !hasExcludedPlayers;
    });
    const sortFct = GAME_SORT_FCTS[sortFctKey.value].sortFct;
    const sorted = cloneDeep(filtered).sort(sortFct);
    setFilteredGames(sorted);
  }, [populatedGames, sortFctKey, visiblePlayers, excludedPlayers]);

  useEffect(() => {
    const urlSortKey = searchParams.get("sort");
    if (
      urlSortKey &&
      Object.values<string>(GameSortFctKey).includes(urlSortKey)
    ) {
      setSortFctKey({
        value: urlSortKey as GameSortFctKey,
        label: getSortFctName(urlSortKey as GameSortFctKey),
      });
    }
  }, [searchParams]);

  function loading(): boolean {
    return loadingGames || loadingPlayers || loadingDecks || populatingGames;
  }

  function handleSort(sortOption: SingleValue<SelectOption>) {
    if (!sortOption) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", sortOption.value);
    }
    setSearchParams(searchParams);
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
            <ReactSelect
              className="react-select-container min-w-40"
              classNamePrefix="react-select"
              name="sortFct"
              options={sortFctOptions}
              value={sortFctKey}
              onChange={handleSort}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Include players
            </Heading>
            <ReactSelect
              className="react-select-container min-w-60"
              classNamePrefix="react-select"
              name="visiblePlayers"
              options={playerSelectOptions}
              value={visiblePlayers}
              onChange={setVisiblePlayers}
              isMulti
              closeMenuOnSelect={false}
            />
          </div>
          <div>
            <Heading className="mb-1" size="3">
              Exclude players
            </Heading>
            <ReactSelect
              className="react-select-container min-w-60"
              classNamePrefix="react-select"
              name="excludedPlayers"
              options={playerSelectOptions}
              value={excludedPlayers}
              onChange={setExcludedPlayers}
              closeMenuOnSelect={false}
              isMulti
            />
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
