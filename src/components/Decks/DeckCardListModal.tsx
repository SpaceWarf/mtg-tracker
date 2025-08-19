import { ExternalLinkIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import { ArchidektService } from "../../services/Archidekt";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { DeckWithStats } from "../../state/Deck";
import { CardList } from "../Cards/CardList";
import { CardListFilters } from "../Cards/CardListFilters";
import { DeckHeader } from "./DeckHeader";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckCardListModal({ deck }: OwnProps) {
  const [open, setOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");

  function handleCardListFiltersChange(
    groupBy: CardGroupBy,
    sortBy: CardSortFctKey,
    search: string
  ) {
    setGroupBy(groupBy);
    setSortBy(sortBy);
    setSearch(search);
  }

  return (
    <Dialog.Root onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button>
          <ListBulletIcon width="18" height="18" />
          Open Decklist
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content className="max-w-full">
        <Flex className="mb-5" justify="between">
          <Flex gap="5">
            <Dialog.Title>
              <DeckHeader deck={deck} />
            </Dialog.Title>

            <CardListFilters onChange={handleCardListFiltersChange} />
          </Flex>
          <IconButton
            variant="soft"
            onClick={() =>
              window.open(
                ArchidektService.getDeckUrl(deck.externalId ?? ""),
                "_blank"
              )
            }
          >
            <ExternalLinkIcon width="18" height="18" />
          </IconButton>
        </Flex>

        {open && (
          <CardList
            groupBy={groupBy}
            sortBy={sortBy}
            search={search}
            cards={deck.cards ?? []}
            categories={deck.categories ?? []}
            versions={deck.versions ?? []}
          />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
