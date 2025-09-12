import { Box, CheckboxCards, Flex, Text, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { CardGroupBy, CardGroupByOptions } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import { Icon } from "../Common/Icon";
import { SortFctSelect } from "../Common/Select/SortFctSelect";

type OwnProps = {
  hasVersions: boolean;
  showVersionToggle?: boolean;
  onChange: (
    groupBy: CardGroupBy,
    sortBy: CardSortFctKey,
    search: string,
    showVersionGraph: boolean
  ) => void;
};

export function CardListFilters({
  hasVersions,
  showVersionToggle,
  onChange,
}: OwnProps) {
  const [groupBy, setGroupBy] = useState<SingleValue<SelectOption>>(
    CardGroupByOptions[CardGroupBy.CATEGORY]
  );
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [showVersionGraph, setShowVersionGraph] = useState<boolean>(false);

  useEffect(() => {
    onChange(
      (groupBy?.value as CardGroupBy) ?? CardGroupBy.CATEGORY,
      sortBy,
      search,
      showVersionGraph
    );
  }, [groupBy, sortBy, search, showVersionGraph, onChange]);

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

      {showVersionToggle && hasVersions && (
        <div>
          <CheckboxCards.Root
            className="mt-5"
            value={showVersionGraph ? ["1"] : []}
            onValueChange={() => setShowVersionGraph(!showVersionGraph)}
          >
            <CheckboxCards.Item value="1">
              <Flex direction="column" width="100%">
                <Text weight="bold">Show Version Graph</Text>
              </Flex>
            </CheckboxCards.Item>
          </CheckboxCards.Root>
        </div>
      )}
    </Flex>
  );
}
