import { Box, Flex, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { CardGroupBy, CardGroupByOptions } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import { Icon } from "../Common/Icon";
import { SortFctSelect } from "../Common/Select/SortFctSelect";

type OwnProps = {
  onChange: (
    groupBy: CardGroupBy,
    sortBy: CardSortFctKey,
    search: string
  ) => void;
};

export function CardListFilters({ onChange }: OwnProps) {
  const [groupBy, setGroupBy] = useState<SingleValue<SelectOption>>(
    CardGroupByOptions[CardGroupBy.CATEGORY]
  );
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    onChange(
      (groupBy?.value as CardGroupBy) ?? CardGroupBy.CATEGORY,
      sortBy,
      search
    );
  }, [groupBy, sortBy, search, onChange]);

  return (
    <Flex className="mb-5" gap="5" wrap="wrap">
      <Box width={{ initial: "100%", xs: "60" }}>
        <p className="field-label mb-1">
          <b>Search</b>
        </p>
        <TextField.Root
          className="input-field"
          placeholder="Search…"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        >
          <TextField.Slot>
            <Icon icon="magnifying-glass" />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <Box width={{ initial: "100%", xs: "60" }}>
        <p className="field-label mb-1">
          <b>Group by</b>
        </p>
        <ReactSelect
          className="react-select-container min-w-60"
          classNamePrefix="react-select"
          name="groupBySelect"
          options={Object.values(CardGroupByOptions)}
          value={groupBy}
          onChange={(value: SingleValue<SelectOption>) => setGroupBy(value)}
        />
      </Box>

      <Box width={{ initial: "100%", xs: "60" }}>
        <p className="field-label mb-1">
          <b>Sort by</b>
        </p>
        <SortFctSelect
          type={SortFctType.CARD}
          value={sortBy}
          onChange={(value: string) => setSortBy(value as CardSortFctKey)}
        />
      </Box>
    </Flex>
  );
}
