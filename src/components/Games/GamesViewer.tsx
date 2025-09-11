import { Box, Flex, Heading, Spinner } from "@radix-ui/themes";
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

export function GamesViewer() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortFctKey, setSortFctKey] = useState<SelectOption>(
    searchParams.get("sort")
      ? {
          value: searchParams.get("sort") as GameSortFctKey,
          label: getGameSortFctName(searchParams.get("sort") as GameSortFctKey),
        }
      : {
          value: GameSortFctKey.DATE_DESC,
          label: getGameSortFctName(GameSortFctKey.DATE_DESC),
        }
  );

  const { dbGames, loadingGames } = useGames();
  const [populatingGames, setPopulatingGames] = useState<boolean>(true);
  const [populatedGames, setPopulatedGames] = useState<DbGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<DbGame[]>([]);

  const { dbPlayers, loadingPlayers } = usePlayers();
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>(
    searchParams.get("players")?.split(",") ?? []
  );
  const [excludedPlayers, setExcludedPlayers] = useState<string[]>(
    searchParams.get("excludedPlayers")?.split(",") ?? []
  );

  const { dbDecks, loadingDecks } = useDecks();
  const [visibleDecks, setVisibleDecks] = useState<string[]>(
    searchParams.get("decks")?.split(",") ?? []
  );
  const [excludedDecks, setExcludedDecks] = useState<string[]>(
    searchParams.get("excludedDecks")?.split(",") ?? []
  );

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

  function loading(): boolean {
    return loadingGames || loadingPlayers || loadingDecks || populatingGames;
  }

  function handleSort(value: string) {
    setSortFctKey({
      value: value as GameSortFctKey,
      label: getGameSortFctName(value as GameSortFctKey),
    });

    if (!value) {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    setSearchParams(searchParams);
  }

  function handleSetVisiblePlayers(value: string[]) {
    setVisiblePlayers(value);

    if (value.length === 0) {
      searchParams.delete("players");
    } else {
      searchParams.set("players", value.join(","));
    }
    setSearchParams(searchParams);
  }

  function handleSetExcludedPlayers(value: string[]) {
    setExcludedPlayers(value);

    if (value.length === 0) {
      searchParams.delete("excludedPlayers");
    } else {
      searchParams.set("excludedPlayers", value.join(","));
    }
    setSearchParams(searchParams);
  }

  function handleSetVisibleDecks(value: string[]) {
    setVisibleDecks(value);

    if (value.length === 0) {
      searchParams.delete("decks");
    } else {
      searchParams.set("decks", value.join(","));
    }
    setSearchParams(searchParams);
  }

  function handleSetExcludedDecks(value: string[]) {
    setExcludedDecks(value);

    if (value.length === 0) {
      searchParams.delete("excludedDecks");
    } else {
      searchParams.set("excludedDecks", value.join(","));
    }
    setSearchParams(searchParams);
  }

  if (loading()) {
    return <Spinner className="mt-5" size="3" />;
  }

  return (
    <div className="p-5 w-full max-w-[1950px]">
      <Flex className="mb-5" justify="between" wrap="wrap">
        <Flex gap="5" wrap="wrap">
          <Box width={{ initial: "100%", xs: "60" }}>
            <Heading className="mb-1" size="3">
              Sort by
            </Heading>
            <SortFctSelect
              type={SortFctType.GAME}
              value={sortFctKey.value}
              onChange={handleSort}
            />
          </Box>
          <Box width={{ initial: "100%", xs: "60" }}>
            <Heading className="mb-1" size="3">
              Include players
            </Heading>
            <PlayerSelect
              value={visiblePlayers}
              onChange={handleSetVisiblePlayers}
              isMulti
            />
          </Box>
          <Box width={{ initial: "100%", xs: "60" }}>
            <Heading className="mb-1" size="3">
              Exclude players
            </Heading>
            <PlayerSelect
              value={excludedPlayers}
              onChange={handleSetExcludedPlayers}
              isMulti
            />
          </Box>
          <Box width={{ initial: "100%", xs: "60" }}>
            <Heading className="mb-1" size="3">
              Include decks
            </Heading>
            <DeckSelect
              value={visibleDecks}
              onChange={handleSetVisibleDecks}
              isMulti
            />
          </Box>
          <Box width={{ initial: "100%", xs: "60" }}>
            <Heading className="mb-1" size="3">
              Exclude decks
            </Heading>
            <DeckSelect
              value={excludedDecks}
              onChange={handleSetExcludedDecks}
              isMulti
            />
          </Box>
        </Flex>
        <Box width={{ initial: "100%", xs: "60" }}>
          <Flex className="mt-6" align="center" gap="3" justify="center">
            <div>{auth.user && <GameCreateModal />}</div>
          </Flex>
        </Box>
      </Flex>

      {filteredGames.length ? (
        <GamesCardView games={filteredGames} />
      ) : (
        <div>No results for applied filters.</div>
      )}
    </div>
  );
}
