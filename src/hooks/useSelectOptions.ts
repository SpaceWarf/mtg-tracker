import { useMemo } from "react";
import { SelectOption } from "../state/SelectOption";

export function useSelectOptions<T>(
  data: T[],
  valueKey: keyof T,
  labelKey: keyof T,
  detailKey?: keyof T
): SelectOption[] {
  const options = useMemo(() => {
    return (
      data.map((item) => ({
        value: item[valueKey] as string,
        label: `${item[labelKey] as string} ${
          detailKey ? `(${item[detailKey] as string})` : ""
        }`,
      })) ?? []
    );
  }, [data, valueKey, labelKey, detailKey]);

  return options;
}
