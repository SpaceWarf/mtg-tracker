import { useMemo } from "react";
import { DeckVersion } from "../state/DeckVersion";
import { SelectOption } from "../state/SelectOption";

export function useVersionSelectOptions(data: DeckVersion[]): SelectOption[] {
  const options = useMemo(() => {
    return [
      {
        value: "initial",
        label: "Version 1",
      },
      ...(data.map((item, index) => ({
        value: item.id,
        label: `Version ${index + 2}`,
      })) ?? []),
    ];
  }, [data]);

  return options;
}
