import { useMemo } from "react";
import { DbPlayer } from "../state/Player";
import { SelectOption } from "../state/SelectOption";

export function usePlayerSelectOptions(data: DbPlayer[]): SelectOption[] {
  const options = useMemo(() => {
    return (
      data.map((item) => ({
        value: item.id,
        label: item.name,
        image: `/img/pfp/${item.id}.webp`,
      })) ?? []
    );
  }, [data]);

  return options;
}
