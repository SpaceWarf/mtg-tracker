import { useMemo } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { Bracket } from "../../state/Bracket";
import { SelectOption } from "../../state/SelectOption";

type OwnProps = {
  value?: Bracket;
  menuPlacement?: "top" | "bottom";
  clearable?: boolean;
  onChange: (value: Bracket) => void;
};

export function BracketSelect({
  value,
  menuPlacement = "bottom",
  clearable = true,
  onChange,
}: OwnProps) {
  const options = Object.values(Bracket).map((bracket) => ({
    value: bracket,
    label: bracket,
  }));

  const optionsValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  function handleChange(value: SingleValue<SelectOption>) {
    (onChange as (value: Bracket) => void)(value?.value as Bracket);
  }

  return (
    <ReactSelect
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="bracketSelect"
      options={options}
      value={optionsValue}
      onChange={handleChange}
      menuPlacement={menuPlacement}
      isClearable={clearable}
    />
  );
}
