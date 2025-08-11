import { useMemo } from "react";
import { DbDeck } from "../state/Deck";
import { SelectOption } from "../state/SelectOption";

export function useDeckSelectOptions(data: DbDeck[]): SelectOption[] {
  const options = useMemo(() => {
    return (
      data.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.commander})`,
      })) ?? []
    );
  }, [data]);

  return options;
}
