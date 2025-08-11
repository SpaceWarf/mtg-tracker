import { useMemo } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { useSortFctSelectOptions } from "../../hooks/useSortFctSelectOptions";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";

type OwnProps = {
  type: SortFctType;
  value: string;
  menuPlacement?: "top" | "bottom";
  onChange: (value: string) => void;
};

export function SortFctSelect({
  type,
  value,
  menuPlacement = "bottom",
  onChange,
}: OwnProps) {
  const options = useSortFctSelectOptions(type);

  const optionsValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  function handleChange(value: SingleValue<SelectOption>) {
    (onChange as (value: string) => void)(value?.value ?? "");
  }

  return (
    <ReactSelect
      className="react-select-container w-40"
      classNamePrefix="react-select"
      name="sortFctSelect"
      options={options}
      value={optionsValue}
      onChange={handleChange}
      menuPlacement={menuPlacement}
    />
  );
}
