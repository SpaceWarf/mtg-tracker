import { useMemo } from "react";
import ReactSelect, {
  createFilter,
  MultiValue,
  SingleValue,
} from "react-select";
import { useDecks } from "../../hooks/useDecks";
import { useDeckSelectOptions } from "../../hooks/useDeckSelectOptions";
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
  onChange: (value: string, version: string) => void;
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
      className="select-option-container deck-select-option-container"
      {...innerProps}
    >
      <span>{data.label}</span>
      <span className="detail">{data.detail}</span>
    </div>
  );
}

export function DeckSelect({
  value,
  isMulti,
  onChange,
  menuPlacement = "bottom",
}: MultiProps | SingleProps) {
  const { dbDecks, loadingDecks } = useDecks();
  const deckSelectOptions = useDeckSelectOptions(dbDecks ?? []);
  const optionsValue = useMemo(() => {
    if (isMulti) {
      return deckSelectOptions.filter((option) => value.includes(option.value));
    } else {
      return deckSelectOptions.find((option) => option.value === value);
    }
  }, [isMulti, deckSelectOptions, value]);

  const filterOption = createFilter<SelectOption>({
    stringify: (option) => `${option.label} ${option.data.detail}`,
  });

  function handleChangeMulti(value: MultiValue<SelectOption>) {
    (onChange as (value: string[]) => void)(value.map((v) => v.value));
  }

  function handleChangeSingle(value: SingleValue<SelectOption>) {
    const deck = dbDecks?.find((deck) => deck.id === value?.value);
    (onChange as (value: string, version: string) => void)(
      value?.value ?? "",
      deck?.versions?.[deck.versions.length - 1]?.id ?? ""
    );
  }

  return isMulti ? (
    <ReactSelect
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="deckSelect"
      components={{ Option: CustomOption }}
      filterOption={filterOption}
      options={deckSelectOptions}
      value={optionsValue}
      onChange={handleChangeMulti}
      closeMenuOnSelect={false}
      isLoading={loadingDecks}
      menuPlacement={menuPlacement}
      isMulti
    />
  ) : (
    <ReactSelect
      className="react-select-container"
      classNamePrefix="react-select"
      name="deckSelect"
      components={{ Option: CustomOption }}
      filterOption={filterOption}
      options={deckSelectOptions}
      value={optionsValue}
      onChange={handleChangeSingle}
      isLoading={loadingDecks}
      menuPlacement={menuPlacement}
    />
  );
}
