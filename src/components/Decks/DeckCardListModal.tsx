import { ExternalLinkIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, IconButton } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<CardGroupBy>(CardGroupBy.CATEGORY);
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [search, setSearch] = useState<string>("");
  const [showVersionGraph, setShowVersionGraph] = useState<boolean>(false);

  useEffect(() => {
    const decklist = searchParams.get("decklist");
    if (decklist === deck.id) {
      setOpen(true);
    }
  }, [deck.id, searchParams]);

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
    setOpen(open);
    if (!open) {
      searchParams.delete("decklist");
      searchParams.delete("version");
    } else {
      searchParams.set("decklist", deck.id);
    }
    setSearchParams(searchParams);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button>
          <ListBulletIcon width="18" height="18" />
          Open Decklist
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content
        className="w-[1850px] max-w-[1850px]"
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
            <ExternalLinkIcon width="18" height="18" />
          </IconButton>
        </Flex>

        {open && (
          <CardList
            groupBy={groupBy}
            sortBy={sortBy}
            search={search}
            showVersionGraph={showVersionGraph}
            deck={deck}
          />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
