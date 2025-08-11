import { useMemo } from "react";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
import "../../assets/styles/SelectOptions.scss";
import { usePlayers } from "../../hooks/usePlayers";
import { usePlayerSelectOptions } from "../../hooks/usePlayerSelectOptions";
import { SelectOption } from "../../state/SelectOption";

type SharedProps = {
  menuPlacement?: "top" | "bottom";
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
      <img src={data.image} alt={data.label} className="w-6 h-6 rounded-full" />
      <span>{data.label}</span>
    </div>
  );
}

export function PlayerSelect({
  value,
  isMulti,
  onChange,
  menuPlacement = "bottom",
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

  function handleChangeSingle(value: SingleValue<SelectOption>) {
    (onChange as (value: string) => void)(value?.value ?? "");
  }

  return isMulti ? (
    <ReactSelect
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="playerSelect"
      components={{ Option: CustomOption }}
      options={playerSelectOptions}
      value={optionsValue}
      onChange={handleChangeMulti}
      closeMenuOnSelect={false}
      isLoading={loadingPlayers}
      menuPlacement={menuPlacement}
      isMulti
    />
  ) : (
    <ReactSelect
      className="react-select-container"
      classNamePrefix="react-select"
      name="playerSelect"
      components={{ Option: CustomOption }}
      options={playerSelectOptions}
      value={optionsValue}
      onChange={handleChangeSingle}
      isLoading={loadingPlayers}
      menuPlacement={menuPlacement}
    />
  );
}
