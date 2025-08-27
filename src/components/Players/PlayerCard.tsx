import {
  DotsVerticalIcon,
  ExternalLinkIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Card, DropdownMenu, Flex, IconButton, Tabs } from "@radix-ui/themes";
import { useState } from "react";
import { ArchidektService } from "../../services/Archidekt";
import { DbDeck } from "../../state/Deck";
import { PlayerWithStats } from "../../state/Player";
import { PlayerCardView } from "../../state/PlayerCardView";
import { PlayerDeckStats } from "./PlayerDeckStats";
import { PlayerDeleteModal } from "./PlayerDeleteModal";
import { PlayerEditModal } from "./PlayerEditModal";
import { PlayerGameStats } from "./PlayerGameStats";
import { PlayerHeader } from "./PlayerHeader";

type OwnProps = {
  player: PlayerWithStats;
  decks: DbDeck[];
  editable?: boolean;
  highlightedKey: string;
  highlightedDirection: "asc" | "desc";
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  startCount: number;
  startRate: number;
  startToWinRate: number;
  solRingCount: number;
  solRingRate: number;
  solRingToWinRate: number;
  grandSlamCount: number;
  deckPlayedMap: Map<string, number>;
  deckWonMap: Map<string, number>;
};

export function PlayerCard({
  player,
  decks,
  editable,
  highlightedKey,
  highlightedDirection,
  gamesPlayed,
  winCount,
  winRate,
  startCount,
  startRate,
  startToWinRate,
  solRingCount,
  solRingRate,
  solRingToWinRate,
  grandSlamCount,
  deckPlayedMap,
  deckWonMap,
}: OwnProps) {
  const [view, setView] = useState<PlayerCardView>(PlayerCardView.GAME_STATS);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      {editModalOpen && (
        <PlayerEditModal
          open={editModalOpen}
          player={player}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <PlayerDeleteModal
          open={deleteModalOpen}
          player={player}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
      <Card size="3">
        <Flex>
          <Flex mb="1" flexGrow="1">
            <PlayerHeader player={player} />
          </Flex>
          <Flex gap="3" justify="end">
            {(editable || player.externalId) && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="soft">
                    <DotsVerticalIcon width="18" height="18" />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {player.externalId && (
                    <DropdownMenu.Item
                      className="mb-1"
                      onClick={() =>
                        window.open(
                          ArchidektService.getPlayerProfileUrl(
                            player.externalId
                          ),
                          "_blank"
                        )
                      }
                    >
                      <ExternalLinkIcon width="18" height="18" />
                      Open in Archidekt
                    </DropdownMenu.Item>
                  )}
                  {editable && (
                    <DropdownMenu.Item
                      className="mb-1"
                      onClick={() => setEditModalOpen(true)}
                    >
                      <Pencil1Icon width="18" height="18" />
                      Edit
                    </DropdownMenu.Item>
                  )}
                  {editable && <DropdownMenu.Separator />}
                  {editable && (
                    <DropdownMenu.Item
                      color="red"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      <TrashIcon width="18" height="18" />
                      Delete
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </Flex>
        </Flex>
        <Tabs.Root className="mb-2" value={view}>
          <Tabs.List size="2">
            <Tabs.Trigger
              value={PlayerCardView.GAME_STATS}
              onClick={() => setView(PlayerCardView.GAME_STATS)}
            >
              Game Stats
            </Tabs.Trigger>
            <Tabs.Trigger
              value={PlayerCardView.DECK_STATS}
              onClick={() => setView(PlayerCardView.DECK_STATS)}
            >
              Deck Stats
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        {view === PlayerCardView.GAME_STATS && (
          <PlayerGameStats
            highlightedKey={highlightedKey}
            highlightedDirection={highlightedDirection}
            gamesPlayed={gamesPlayed}
            winCount={winCount}
            winRate={winRate}
            startCount={startCount}
            startRate={startRate}
            startToWinRate={startToWinRate}
            solRingCount={solRingCount}
            solRingRate={solRingRate}
            solRingToWinRate={solRingToWinRate}
            grandSlamCount={grandSlamCount}
          />
        )}

        {view === PlayerCardView.DECK_STATS && (
          <PlayerDeckStats
            decks={decks}
            highlightedKey={highlightedKey}
            highlightedDirection={highlightedDirection}
            deckPlayedMap={deckPlayedMap}
            deckWonMap={deckWonMap}
          />
        )}
      </Card>
    </>
  );
}
