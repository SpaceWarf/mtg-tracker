import { useMemo } from "react";
import { DeckVersion } from "../state/DeckVersion";
import { SelectOption } from "../state/SelectOption";
import { useWindowDimensions } from "./useWindowDimensions";

export function useVersionSelectOptions(data: DeckVersion[]): SelectOption[] {
  const { windowWidth } = useWindowDimensions();

  const options = useMemo(() => {
    return [
      {
        value: "initial",
        label: windowWidth > 520 ? "Version 1" : "v1",
      },
      ...(data.map((item, index) => ({
        value: item.id,
        label: windowWidth > 520 ? `Version ${index + 2}` : `v${index + 2}`,
      })) ?? []),
    ];
  }, [data, windowWidth]);

  return options;
}
