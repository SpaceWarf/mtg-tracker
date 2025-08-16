import { useCallback, useMemo } from "react";
import { CardSortFctKey } from "../state/CardSortFctKey";
import { getCardSortFctName } from "../state/CardSortFcts";
import { DeckSortFctKey } from "../state/DeckSortFctKey";
import { getDeckSortFctName } from "../state/DeckSortFcts";
import { GameSortFctKey } from "../state/GameSortFctKey";
import { getGameSortFctName } from "../state/GameSortFcts";
import { PlayerSortFctKey } from "../state/PlayerSortFctKey";
import { getPlayerSortFctName } from "../state/PlayerSortFcts";
import { SelectOption } from "../state/SelectOption";
import { SortFctType } from "../state/SortFctType";

export function useSortFctSelectOptions(type: SortFctType): SelectOption[] {
  const sortFctKey = useMemo(() => {
    switch (type) {
      case SortFctType.DECK:
        return DeckSortFctKey;
      case SortFctType.PLAYER:
        return PlayerSortFctKey;
      case SortFctType.GAME:
        return GameSortFctKey;
      case SortFctType.CARD:
        return CardSortFctKey;
    }
  }, [type]);

  const getSortFctName = useCallback(
    (
      key: DeckSortFctKey | PlayerSortFctKey | GameSortFctKey | CardSortFctKey
    ): string => {
      switch (type) {
        case SortFctType.DECK:
          return getDeckSortFctName(key as DeckSortFctKey);
        case SortFctType.PLAYER:
          return getPlayerSortFctName(key as PlayerSortFctKey);
        case SortFctType.GAME:
          return getGameSortFctName(key as GameSortFctKey);
        case SortFctType.CARD:
          return getCardSortFctName(key as CardSortFctKey);
        default:
          throw new Error(`Invalid sort function type: ${type}`);
      }
    },
    [type]
  );

  const options = useMemo(() => {
    return Object.values(sortFctKey).map((key) => ({
      value: key,
      label: getSortFctName(key),
    }));
  }, [sortFctKey, getSortFctName]);

  return options;
}
