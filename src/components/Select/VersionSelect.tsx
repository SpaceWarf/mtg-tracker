import { useMemo } from "react";
import ReactSelect, {
  createFilter,
  MultiValue,
  SingleValue,
} from "react-select";
import { useDecks } from "../../hooks/useDecks";
import { useVersionSelectOptions } from "../../hooks/useVersionSelectOptions";
import { SelectOption } from "../../state/SelectOption";

type SharedProps = {
  deckId: string;
  menuPlacement?: "top" | "bottom";
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
  onChange: (value: string, version: string) => void;
} & SharedProps;

export function VersionSelect({
  deckId,
  value,
  isMulti,
  onChange,
  menuPlacement = "bottom",
  disabled = false,
}: MultiProps | SingleProps) {
  const { dbDecks, loadingDecks } = useDecks();
  const deck = useMemo(() => {
    return dbDecks?.find((deck) => deck.id === deckId);
  }, [dbDecks, deckId]);
  const versionSelectOptions = useVersionSelectOptions(deck?.versions ?? []);
  const optionsValue = useMemo(() => {
    if (isMulti) {
      return versionSelectOptions.filter((option) =>
        value.includes(option.value)
      );
    } else {
      return versionSelectOptions.find((option) => option.value === value);
    }
  }, [isMulti, versionSelectOptions, value]);

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
      name="versionSelect"
      filterOption={filterOption}
      options={versionSelectOptions}
      value={optionsValue}
      onChange={handleChangeMulti}
      closeMenuOnSelect={false}
      isLoading={loadingDecks}
      menuPlacement={menuPlacement}
      isMulti
      isDisabled={disabled}
    />
  ) : (
    <ReactSelect
      className="react-select-container"
      classNamePrefix="react-select"
      name="versionSelect"
      filterOption={filterOption}
      options={versionSelectOptions}
      value={optionsValue}
      onChange={handleChangeSingle}
      isLoading={loadingDecks}
      menuPlacement={menuPlacement}
      isDisabled={disabled}
    />
  );
}
