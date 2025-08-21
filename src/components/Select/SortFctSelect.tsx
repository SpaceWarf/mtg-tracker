import { useMemo } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { useSortFctSelectOptions } from "../../hooks/useSortFctSelectOptions";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";

type OwnProps = {
  type: SortFctType;
  value: string;
  menuPlacement?: "top" | "bottom";
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function SortFctSelect({
  type,
  value,
  menuPlacement = "bottom",
  disabled = false,
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
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="sortFctSelect"
      options={options}
      value={optionsValue}
      onChange={handleChange}
      menuPlacement={menuPlacement}
      isDisabled={disabled}
    />
  );
}
