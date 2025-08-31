import { useMemo } from "react";
import { DbDeck } from "../state/Deck";
import { SelectOption } from "../state/SelectOption";

export function useDeckSelectOptions(data: DbDeck[]): SelectOption[] {
  const options = useMemo(() => {
    return (
      data
        .filter((item) => !item.gameChangersDeck)
        .map((item) => ({
          value: item.id,
          label: item.name,
          detail: item.commander,
          image: item.featured,
        })) ?? []
    );
  }, [data]);

  return options;
}
