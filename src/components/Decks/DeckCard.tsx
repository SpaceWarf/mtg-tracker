import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Card, Flex, IconButton, Tabs, Text } from "@radix-ui/themes";
import { useState } from "react";
import { ArchidektService } from "../../services/Archidekt";
import { DeckWithStats } from "../../state/Deck";
import { DeckCardView } from "../../state/DeckCardView";
import { getDateTimeString } from "../../utils/Date";
import { DeckCardListModal } from "./DeckCardListModal";
import { DeckDetailsTable } from "./DeckDetailsTable";
import { DeckEditModal } from "./DeckEditModal";
import { DeckHeader } from "./DeckHeader";
import { DeckStatsTable } from "./DeckStatsTable";

type OwnProps = {
  deck: DeckWithStats;
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
};

export function DeckCard({
  deck,
  editable,
  highlightedKey,
  highlightedDirection,
}: OwnProps) {
  const [view, setView] = useState<DeckCardView>(DeckCardView.DECK_STATS);

  return (
    <Card size="3">
      <Flex className="mb-3" justify="between">
        <DeckHeader deck={deck} size="small" />
        <Flex className="ml-2" gap="3">
          {deck.externalId && (
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
          )}
          {editable && <DeckEditModal deck={deck} />}
        </Flex>
      </Flex>

      <Tabs.Root className="mb-2" value={view}>
        <Tabs.List size="2">
          <Tabs.Trigger
            value={DeckCardView.DECK_STATS}
            onClick={() => setView(DeckCardView.DECK_STATS)}
          >
            Stats
          </Tabs.Trigger>
          {deck.externalId && (
            <Tabs.Trigger
              value={DeckCardView.DECK_DETAILS}
              onClick={() => setView(DeckCardView.DECK_DETAILS)}
            >
              Details
            </Tabs.Trigger>
          )}
        </Tabs.List>
      </Tabs.Root>

      <div className="mb-2">
        {view === DeckCardView.DECK_STATS && (
          <DeckStatsTable
            deck={deck}
            highlightedKey={highlightedKey}
            highlightedDirection={highlightedDirection}
          />
        )}

        {view === DeckCardView.DECK_DETAILS && <DeckDetailsTable deck={deck} />}
      </div>

      <Flex direction="column" gap="2">
        {deck.externalId && <DeckCardListModal deck={deck} />}

        {deck.updatedAt && (
          <Text size="1" color="gray">
            <i>Last synced on {getDateTimeString(deck.updatedAt)}</i>
          </Text>
        )}
      </Flex>
    </Card>
  );
}
