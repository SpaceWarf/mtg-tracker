import { Box, DropdownMenu, Flex, Grid, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import "../../assets/styles/GameCard.scss";
import { DbGame } from "../../state/Game";
import { Icon } from "../Common/Icon";
import { GameDeleteModal } from "./GameDeleteModal";
import { GameEditModal } from "./GameEditModal";
import { GamePlayerPreview } from "./GamePlayerPreview";

type OwnProps = {
  game: DbGame;
  index: number;
  editable?: boolean;
};

export function GameCard2({ game, index, editable }: OwnProps) {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

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

      <Box className="game-card item-card">
        <Flex className="h-full" direction="column" justify="between">
          <Flex className="content-container" direction="column" gap="3">
            <Flex justify="between">
              <Flex gap="2" align="center">
                <p className="name">
                  Game {index + 1} {game.comments ? "-" : ""}
                </p>
                <p className="comments">{game.comments}</p>
              </Flex>
              {editable && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton variant="soft" color="gray">
                      <Icon icon="ellipsis-v" />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      className="mb-1"
                      onClick={() => setEditModalOpen(true)}
                    >
                      <Icon icon="pen" />
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      color="red"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      <Icon icon="trash" />
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              )}
            </Flex>
            <Grid columns={{ initial: "1", xs: "2" }} width="100%" gap="4">
              {[game.player1, game.player2, game.player3, game.player4].map(
                (player) => (
                  <GamePlayerPreview key={player.player} player={player} />
                )
              )}
            </Grid>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
