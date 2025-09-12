import { Avatar, Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import ReactSelect, {
  components,
  createFilter,
  MultiValue,
  MultiValueGenericProps,
  SingleValue,
  SingleValueProps,
} from "react-select";
import { useDecks } from "../../../hooks/useDecks";
import { useDeckSelectOptions } from "../../../hooks/useDeckSelectOptions";
import { SelectOption } from "../../../state/SelectOption";
import { Icon } from "../Icon";

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
  onChange: (value: string, version: string) => void;
} & SharedProps;

export function DeckSelect({
  value,
  isMulti,
  onChange,
  menuPlacement = "bottom",
  clearable = true,
  disabled = false,
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

  function handleChangeSingle(
    value: SingleValue<SelectOption> | MultiValue<SelectOption>
  ) {
    const val = value as SingleValue<SelectOption>;
    const deck = dbDecks?.find((deck) => deck.id === val?.value);
    (onChange as (value: string, version: string) => void)(
      val?.value ?? "",
      deck?.versions?.[deck.versions.length - 1]?.id ?? ""
    );
  }

  return isMulti ? (
    <ReactSelect
      className="react-select-container min-w-60"
      classNamePrefix="react-select"
      name="deckSelect"
      components={{
        Option: CustomOption,
        MultiValueLabel: CustomMultiValueLabel,
      }}
      filterOption={filterOption}
      options={deckSelectOptions}
      value={optionsValue}
      onChange={handleChangeMulti}
      closeMenuOnSelect={false}
      isLoading={loadingDecks}
      menuPlacement={menuPlacement}
      isMulti
      isClearable={clearable}
      isDisabled={disabled}
    />
  ) : (
    <ReactSelect
      className="react-select-container"
      classNamePrefix="react-select"
      name="deckSelect"
      components={{ Option: CustomOption, SingleValue: CustomValue }}
      filterOption={filterOption}
      options={deckSelectOptions}
      value={optionsValue}
      onChange={handleChangeSingle}
      isLoading={loadingDecks}
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
      className="select-option-container deck-select-option-container"
      {...innerProps}
    >
      <Flex gap="2" align="center">
        <Avatar
          src={data.image}
          fallback={<Icon icon="user" />}
          radius="full"
          size="2"
        />
        <Flex direction="column">
          <span>{data.label}</span>
          <span className="detail">{data.detail}</span>
        </Flex>
      </Flex>
    </div>
  );
}

const CustomValue = ({ ...props }: SingleValueProps<SelectOption>) => (
  <components.SingleValue {...props}>
    <Flex gap="2" align="center">
      <Avatar
        src={props.data.image}
        fallback={<Icon icon="user" />}
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
          fallback={<Icon icon="user" />}
          radius="full"
          size="1"
        />
        <span>{props.data.label}</span>
      </Flex>
    </components.MultiValueLabel>
  );
};
