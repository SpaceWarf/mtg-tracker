import { Box, Grid, Spinner } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { FiltersContext } from "../../contexts/FiltersContext";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { GameSortFctKey } from "../../state/GameSortFctKey";
import { GAME_SORT_FCTS } from "../../state/GameSortFcts";
import { DbPlayer } from "../../state/Player";
import { SortFctType } from "../../state/SortFctType";
import {
  gameHasAllDecks,
  gameHasAllPlayers,
  gameHasSomeDecks,
  gameHasSomePlayers,
} from "../../utils/Game";
import { DataCard } from "../Common/DataCard";
import { Icon } from "../Common/Icon";
import { NoResults } from "../Common/NoResults";
import { DeckSelect } from "../Common/Select/DeckSelect";
import { PlayerSelect } from "../Common/Select/PlayerSelect";
import { SortFctSelect } from "../Common/Select/SortFctSelect";
import { GameCreateModal } from "./GameCreateModal";
import { GamesCardView } from "./GamesCardView";

export function GamesViewer() {
  const {
    gameSortBy,
    setGameSortBy,
    gameIncludedPlayers,
    setGameIncludedPlayers,
    gameExcludedPlayers,
    setGameExcludedPlayers,
    gameIncludedDecks,
    setGameIncludedDecks,
    gameExcludedDecks,
    setGameExcludedDecks,
  } = useContext(FiltersContext);

  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const { dbGames, loadingGames } = useGames();
  const { dbDecks, loadingDecks } = useDecks();
  const { dbPlayers, loadingPlayers } = usePlayers();

  const [populatingGames, setPopulatingGames] = useState<boolean>(true);
  const [populatedGames, setPopulatedGames] = useState<DbGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<DbGame[]>([]);

  const loading = useMemo(() => {
    return loadingGames || loadingPlayers || loadingDecks || populatingGames;
  }, [loadingGames, loadingPlayers, loadingDecks, populatingGames]);

  const hasFiltersApplied = useMemo(() => {
    return (
      gameIncludedPlayers.length > 0 ||
      gameExcludedPlayers.length > 0 ||
      gameIncludedDecks.length > 0 ||
      gameExcludedDecks.length > 0
    );
  }, [
    gameIncludedPlayers,
    gameExcludedPlayers,
    gameIncludedDecks,
    gameExcludedDecks,
  ]);

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
    const params: Record<string, string> = {
      sort: searchParams.get("sort") ?? gameSortBy,
      players: searchParams.get("players") ?? gameIncludedPlayers.join(","),
      excludedPlayers:
        searchParams.get("excludedPlayers") ?? gameExcludedPlayers.join(","),
      decks: searchParams.get("decks") ?? gameIncludedDecks.join(","),
      excludedDecks:
        searchParams.get("excludedDecks") ?? gameExcludedDecks.join(","),
    };

    if (
      params.sort &&
      Object.values<string>(GameSortFctKey).includes(params.sort)
    ) {
      setGameSortBy(params.sort as GameSortFctKey);
    } else {
      delete params.sort;
    }

    if (params.players) {
      setGameIncludedPlayers(params.players.split(","));
    } else {
      delete params.players;
    }

    if (params.excludedPlayers) {
      setGameExcludedPlayers(params.excludedPlayers.split(","));
    } else {
      delete params.excludedPlayers;
    }

    if (params.decks) {
      setGameIncludedDecks(params.decks.split(","));
    } else {
      delete params.decks;
    }

    if (params.excludedDecks) {
      setGameExcludedDecks(params.excludedDecks.split(","));
    } else {
      delete params.excludedDecks;
    }

    setSearchParams(params);

    // We only want to run this effect once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = cloneDeep(populatedGames).filter((game) => {
      const hasVisiblePlayers = gameHasAllPlayers(game, gameIncludedPlayers);
      const hasExcludedPlayers = gameHasSomePlayers(game, gameExcludedPlayers);
      const hasVisibleDecks = gameHasAllDecks(game, gameIncludedDecks);
      const hasExcludedDecks = gameHasSomeDecks(game, gameExcludedDecks);

      return (
        hasVisiblePlayers &&
        !hasExcludedPlayers &&
        hasVisibleDecks &&
        !hasExcludedDecks
      );
    });
    const sortFct = GAME_SORT_FCTS[gameSortBy].sortFct;
    const sorted = cloneDeep(filtered).sort(sortFct);
    setFilteredGames(sorted);
  }, [
    populatedGames,
    gameSortBy,
    gameIncludedPlayers,
    gameExcludedPlayers,
    gameIncludedDecks,
    gameExcludedDecks,
  ]);

  function handleSort(value: string) {
    setGameSortBy(value as GameSortFctKey);

    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  function handleSetVisiblePlayers(value: string[]) {
    setGameIncludedPlayers(value);

    if (value.length === 0) {
      searchParams.delete("players");
    } else {
      searchParams.set("players", value.join(","));
    }
    setSearchParams(searchParams);
  }

  function handleSetExcludedPlayers(value: string[]) {
    setGameExcludedPlayers(value);

    if (value.length === 0) {
      searchParams.delete("excludedPlayers");
    } else {
      searchParams.set("excludedPlayers", value.join(","));
    }
    setSearchParams(searchParams);
  }

  function handleSetVisibleDecks(value: string[]) {
    setGameIncludedDecks(value);

    if (value.length === 0) {
      searchParams.delete("decks");
    } else {
      searchParams.set("decks", value.join(","));
    }
    setSearchParams(searchParams);
  }

  function handleSetExcludedDecks(value: string[]) {
    setGameExcludedDecks(value);

    if (value.length === 0) {
      searchParams.delete("excludedDecks");
    } else {
      searchParams.set("excludedDecks", value.join(","));
    }
    setSearchParams(searchParams);
  }

  if (loading) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full max-w-[1950px]">
      <Grid columns="1" gap="5">
        <DataCard
          title="Games"
          icon={<Icon icon="dice" />}
          direction="row"
          pageHeader
        >
          <Grid width="125px" gap="3" columns="1">
            {auth.user && <GameCreateModal />}
          </Grid>
        </DataCard>
        <DataCard
          title="Filters"
          icon={<Icon icon="filter" />}
          collapsable
          defaultCollapsed={!hasFiltersApplied}
        >
          <Grid
            gap="5"
            columns={{ initial: "1", xs: "2", sm: "3", md: "4", lg: "5" }}
          >
            <Box>
              <p className="mb-1">
                <b>Sort by</b>
              </p>
              <SortFctSelect
                type={SortFctType.GAME}
                value={gameSortBy}
                onChange={handleSort}
              />
            </Box>
            <Box>
              <p className="mb-1">
                <b>Include players</b>
              </p>
              <PlayerSelect
                value={gameIncludedPlayers}
                onChange={handleSetVisiblePlayers}
                isMulti
              />
            </Box>
            <Box>
              <p className="mb-1">
                <b>Exclude players</b>
              </p>
              <PlayerSelect
                value={gameExcludedPlayers}
                onChange={handleSetExcludedPlayers}
                isMulti
              />
            </Box>
            <Box>
              <p className="mb-1">
                <b>Include decks</b>
              </p>
              <DeckSelect
                value={gameIncludedDecks}
                onChange={handleSetVisibleDecks}
                isMulti
              />
            </Box>
            <Box>
              <p className="mb-1">
                <b>Exclude decks</b>
              </p>
              <DeckSelect
                value={gameExcludedDecks}
                onChange={handleSetExcludedDecks}
                isMulti
              />
            </Box>
          </Grid>
        </DataCard>
        {filteredGames.length ? (
          <GamesCardView games={filteredGames} />
        ) : (
          <NoResults />
        )}
      </Grid>
    </div>
  );
}
