import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Card, Flex, IconButton, Tabs } from "@radix-ui/themes";
import { useState } from "react";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { DbDeck } from "../../state/Deck";
import { DeckCardView } from "../../state/DeckCardView";
import { DeckDetailsTable } from "./DeckDetailsTable";
import { DeckEditModal } from "./DeckEditModal";
import { DeckHeader } from "./DeckHeader";
import { DeckStatsTable } from "./DeckStatsTable";

type OwnProps = {
  deck: DbDeck;
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
  gamesPlayed: number;
  winCount: number;
  winRate: number;
};

export function DeckCard({
  deck,
  editable,
  highlightedKey,
  highlightedDirection,
  gamesPlayed,
  winCount,
  winRate,
}: OwnProps) {
  const { dbPlayers } = usePlayers();
  const [view, setView] = useState<DeckCardView>(DeckCardView.DECK_STATS);

  function getPlayerName(id: string): string {
    return (dbPlayers || []).find((player) => player.id === id)?.name ?? "-";
  }

  return (
    <Card size="3">
      <Flex className="mb-3" justify="between">
        <DeckHeader
          title={deck.name}
          commanders={deck.commander}
          featured={deck.featured ?? ""}
          colourIdentity={deck.colourIdentity ?? []}
          size="small"
        />
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

      {view === DeckCardView.DECK_STATS && (
        <DeckStatsTable
          highlightedKey={highlightedKey}
          highlightedDirection={highlightedDirection}
          gamesPlayed={gamesPlayed}
          winCount={winCount}
          winRate={winRate}
          builder={getPlayerName(deck.builder ?? "")}
        />
      )}

      {view === DeckCardView.DECK_DETAILS && (
        <DeckDetailsTable
          format={deck.format ?? ""}
          price={deck.price ?? ""}
          saltSum={deck.saltSum ?? ""}
          size={deck.size ?? ""}
          viewCount={deck.viewCount ?? ""}
          deckCreatedAt={deck.deckCreatedAt ?? ""}
          deckUpdatedAt={deck.deckUpdatedAt ?? ""}
        />
      )}
    </Card>
  );
}
