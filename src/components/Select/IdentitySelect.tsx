import { useMemo } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { IdentityLabel } from "../../state/IdentityLabel";
import { SelectOption } from "../../state/SelectOption";

type OwnProps = {
  value: IdentityLabel;
  menuPlacement?: "top" | "bottom";
  clearable?: boolean;
  onChange: (value: IdentityLabel) => void;
};

export function IdentitySelect({
  value,
  menuPlacement = "bottom",
  clearable = true,
  onChange,
}: OwnProps) {
  const options = Object.values(IdentityLabel).map((identity) => ({
    value: identity,
    label: identity,
  }));

  const optionsValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  function handleChange(value: SingleValue<SelectOption>) {
    (onChange as (value: IdentityLabel) => void)(value?.value as IdentityLabel);
  }

  return (
    <ReactSelect
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="identitySelect"
      options={options}
      value={optionsValue}
      onChange={handleChange}
      menuPlacement={menuPlacement}
      isClearable={clearable}
    />
  );
}
