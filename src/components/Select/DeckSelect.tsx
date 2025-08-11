import { useMemo } from "react";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
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
  onChange: (value: string) => void;
} & SharedProps;

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
      name="deckSelect"
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
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="deckSelect"
      options={deckSelectOptions}
      value={optionsValue}
      onChange={handleChangeSingle}
      isLoading={loadingDecks}
      menuPlacement={menuPlacement}
    />
  );
}
