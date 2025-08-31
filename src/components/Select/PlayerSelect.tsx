import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import ReactSelect, {
  components,
  MultiValue,
  MultiValueGenericProps,
  SingleValue,
  SingleValueProps,
} from "react-select";
import "../../assets/styles/SelectOptions.scss";
import { usePlayers } from "../../hooks/usePlayers";
import { usePlayerSelectOptions } from "../../hooks/usePlayerSelectOptions";
import { SelectOption } from "../../state/SelectOption";

type SharedProps = {
  menuPlacement?: "top" | "bottom";
  clearable?: boolean;
  disabled?: boolean;
};

type MultiProps = {
  value: string[];
  isMulti: true;
  onChange: (value: string[]) => void;
} & SharedProps;

type SingleProps = {
  value: string;
  isMulti: false;
  onChange: (value: string) => void;
} & SharedProps;

export function PlayerSelect({
  value,
  isMulti,
  onChange,
  menuPlacement = "bottom",
  clearable = true,
  disabled = false,
}: MultiProps | SingleProps) {
  const { dbPlayers, loadingPlayers } = usePlayers();
  const playerSelectOptions = usePlayerSelectOptions(dbPlayers ?? []);
  const optionsValue = useMemo(() => {
    if (isMulti) {
      return playerSelectOptions.filter((option) =>
        value.includes(option.value)
      );
    } else {
      return playerSelectOptions.find((option) => option.value === value);
    }
  }, [isMulti, playerSelectOptions, value]);

  function handleChangeMulti(value: MultiValue<SelectOption>) {
    (onChange as (value: string[]) => void)(value.map((v) => v.value));
  }

  function handleChangeSingle(
    value: SingleValue<SelectOption> | MultiValue<SelectOption>
  ) {
    const val = value as SingleValue<SelectOption>;
    (onChange as (value: string) => void)(val?.value ?? "");
  }

  return isMulti ? (
    <ReactSelect
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="playerSelect"
      components={{
        Option: CustomOption,
        MultiValueLabel: CustomMultiValueLabel,
      }}
      options={playerSelectOptions}
      value={optionsValue}
      onChange={handleChangeMulti}
      closeMenuOnSelect={false}
      isLoading={loadingPlayers}
      menuPlacement={menuPlacement}
      isClearable={clearable}
      isDisabled={disabled}
      isMulti
    />
  ) : (
    <ReactSelect
      className="react-select-container"
      classNamePrefix="react-select"
      name="playerSelect"
      components={{ Option: CustomOption, SingleValue: CustomValue }}
      options={playerSelectOptions}
      value={optionsValue}
      onChange={handleChangeSingle}
      isLoading={loadingPlayers}
      menuPlacement={menuPlacement}
      isClearable={clearable}
      isDisabled={disabled}
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
      className="select-option-container player-select-option-container "
      {...innerProps}
    >
      <Avatar
        src={data.image}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="full"
        size="2"
      />
      <span>{data.label}</span>
    </div>
  );
}

const CustomValue = ({ ...props }: SingleValueProps<SelectOption>) => (
  <components.SingleValue {...props}>
    <Flex gap="2" align="center">
      <Avatar
        src={props.data.image}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="full"
        size="2"
      />
      <span>{props.data.label}</span>
    </Flex>
  </components.SingleValue>
);

const CustomMultiValueLabel = (props: MultiValueGenericProps<SelectOption>) => {
  return (
    <components.MultiValueLabel {...props}>
      <Flex gap="2" align="center">
        <Avatar
          src={props.data.image}
          fallback={<FontAwesomeIcon icon={faUser} />}
          radius="full"
          size="1"
        />
        <span>{props.data.label}</span>
      </Flex>
    </components.MultiValueLabel>
  );
};
