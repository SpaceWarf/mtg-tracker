import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import { ArchidektService } from "../../services/Archidekt";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { DeckWithStats } from "../../state/Deck";
import { CardList } from "../Cards/CardList";
import { CardListFilters } from "../Cards/CardListFilters";
import { Icon } from "../Common/Icon";
import { DeckHeader } from "./DeckHeader";

type OwnProps = {
  open: boolean;
  deck: DeckWithStats;
  onClose: () => void;
};

export function DeckCardListModal({ open, deck, onClose }: OwnProps) {
  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [showVersionGraph, setShowVersionGraph] = useState<boolean>(false);

  function handleCardListFiltersChange(
    groupBy: CardGroupBy,
    sortBy: CardSortFctKey,
    search: string,
    showVersionGraph: boolean
  ) {
    setGroupBy(groupBy);
    setSortBy(sortBy);
    setSearch(search);
    setShowVersionGraph(showVersionGraph);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Description></Dialog.Description>

      <Dialog.Content
        width="full"
        maxWidth="calc(100vw - 45px)"
        style={{ overflow: "hidden" }}
      >
        <Flex className="mb-5" justify="between">
          <Flex gap="5">
            <Dialog.Title>
              <DeckHeader deck={deck} />
            </Dialog.Title>

            <CardListFilters
              hasVersions={(deck.versions?.length ?? 0) > 0}
              onChange={handleCardListFiltersChange}
            />
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
            <Icon icon="external-link" />
          </IconButton>
        </Flex>

        <CardList
          groupBy={groupBy}
          sortBy={sortBy}
          search={search}
          showVersionGraph={showVersionGraph}
          deck={deck}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
