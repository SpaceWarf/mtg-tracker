import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Heading, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { CardGroupBy, CardGroupByOptions } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import { SortFctSelect } from "../Select/SortFctSelect";

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
    <Flex className="mb-5" gap="5">
      <div className="w-60">
        <Heading className="mb-1" size="3">
          Search
        </Heading>
        <TextField.Root
          className="input-field"
          placeholder="Search…"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
      </div>

      <div>
        <Heading className="mb-1" size="3">
          Group by
        </Heading>
        <ReactSelect
          className="react-select-container min-w-60"
          classNamePrefix="react-select"
          name="groupBySelect"
          options={Object.values(CardGroupByOptions)}
          value={groupBy}
          onChange={(value: SingleValue<SelectOption>) => setGroupBy(value)}
        />
      </div>

      <div>
        <Heading className="mb-1" size="3">
          Sort by
        </Heading>
        <SortFctSelect
          type={SortFctType.CARD}
          value={sortBy}
          onChange={(value: string) => setSortBy(value as CardSortFctKey)}
        />
      </div>
    </Flex>
  );
}
