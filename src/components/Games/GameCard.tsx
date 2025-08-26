import {
  DotsVerticalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  DropdownMenu,
  Flex,
  Grid,
  IconButton,
  Separator,
} from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { DbGame, GamePlayer } from "../../state/Game";
import { GameDeleteModal } from "./GameDeleteModal";
import { GameEditModal } from "./GameEditModal";
import { GamePlayerSection } from "./GamePlayerSection";

type OwnProps = {
  game: DbGame;
  editable?: boolean;
};

export function GameCard({ game, editable }: OwnProps) {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const orderedPlayerNames = [
    game.player1.playerObj?.name ?? "",
    game.player2.playerObj?.name ?? "",
    game.player3.playerObj?.name ?? "",
    game.player4.playerObj?.name ?? "",
  ].sort();

  const getPlayerbyName = useCallback(
    (name: string): GamePlayer => {
      const player = [
        game.player1,
        game.player2,
        game.player3,
        game.player4,
      ].find((player) => player.playerObj?.name === name);

      if (!player) {
        throw new Error("Error: Could not find player.");
      }
      return player;
    },
    [game]
  );

  return (
    <>
      {editModalOpen && (
        <GameEditModal
          open={editModalOpen}
          game={game}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <GameDeleteModal
          open={deleteModalOpen}
          game={game}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
      <Card size="3">
        <Flex gap="3" justify="between">
          <Flex flexGrow="1">
            <Grid columns="2" rows="2" width="100%" gap="5">
              <GamePlayerSection
                player={getPlayerbyName(orderedPlayerNames[0])}
              />
              <GamePlayerSection
                player={getPlayerbyName(orderedPlayerNames[1])}
              />
              <GamePlayerSection
                player={getPlayerbyName(orderedPlayerNames[2])}
              />
              <GamePlayerSection
                player={getPlayerbyName(orderedPlayerNames[3])}
              />
            </Grid>
          </Flex>
          {editable && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton variant="soft">
                  <DotsVerticalIcon width="18" height="18" />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  className="mb-1"
                  onClick={() => setEditModalOpen(true)}
                >
                  <Pencil1Icon width="18" height="18" />
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="red"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <TrashIcon width="18" height="18" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>
        {game.comments && (
          <>
            <Separator className="mt-5 mb-3" size="4" />
            <p>{game.comments}</p>
          </>
        )}
      </Card>
    </>
  );
}
