import { useMemo } from "react";
import ReactSelect, {
  components,
  MultiValue,
  SingleValue,
  SingleValueProps,
} from "react-select";
import { IdentityLabel } from "../../state/IdentityLabel";
import { GroupedOption, SelectOption } from "../../state/SelectOption";
import { IdentityHeader } from "../Common/IdentityHeader";

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

  const optionsValue: SelectOption | undefined = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const groupedOptions: GroupedOption[] = useMemo(() => {
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

  function handleChange(
    value: SingleValue<SelectOption> | MultiValue<SelectOption>
  ) {
    const val = value as SingleValue<SelectOption>;
    (onChange as (value: IdentityLabel) => void)(val?.value as IdentityLabel);
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
      components={{ Option: CustomOption, SingleValue: CustomValue }}
    />
  );
}

function CustomOption({
  data,
  innerProps,
}: {
  data: SelectOption;
  innerProps: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      className="select-option-container identity-select-option-container"
      {...innerProps}
    >
      <IdentityHeader label={data.label} />
    </div>
  );
}

const CustomValue = ({ ...props }: SingleValueProps<SelectOption>) => (
  <components.SingleValue {...props}>
    <IdentityHeader label={props.data.label} />
  </components.SingleValue>
);
