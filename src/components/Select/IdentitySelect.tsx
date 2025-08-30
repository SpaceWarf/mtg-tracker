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

  const groupedOptions = useMemo(() => {
    function getLabel(size: number) {
      switch (size) {
        case 1:
          return "Mono";
        default:
          return `${size}-Colors`;
      }
    }
    return [1, 2, 3, 4, 5].map((size) => ({
      label: getLabel(size),
      options: options.filter(
        (option) => option.value.split(/\(|\)/)[1].split("").length === size
      ),
    }));
  }, [options]);

  function handleChange(value: SingleValue<SelectOption>) {
    (onChange as (value: IdentityLabel) => void)(value?.value as IdentityLabel);
  }

  return (
    <ReactSelect
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="identitySelect"
      options={groupedOptions}
      value={optionsValue}
      onChange={handleChange}
      menuPlacement={menuPlacement}
      isClearable={clearable}
    />
  );
}
