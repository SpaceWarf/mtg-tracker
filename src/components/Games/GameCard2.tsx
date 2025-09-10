import { faEllipsisV, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, DropdownMenu, Flex, Grid, IconButton } from "@radix-ui/themes";
import { useCallback, useState } from "react";
import "../../assets/styles/GameCard.scss";
import { DbGame, GamePlayer } from "../../state/Game";
import { GameDeleteModal } from "./GameDeleteModal";
import { GameEditModal } from "./GameEditModal";
import { GamePlayerSection } from "./GamePlayerSection";

type OwnProps = {
  game: DbGame;
  editable?: boolean;
};

export function GameCard2({ game, editable }: OwnProps) {
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

      <Box className="game-card item-card">
        <Flex className="h-full" direction="column" justify="between">
          <Flex className="content-container" direction="column" gap="3">
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
                    <IconButton variant="soft" color="gray">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      className="mb-1"
                      onClick={() => setEditModalOpen(true)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      color="red"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              )}
            </Flex>
          </Flex>
          {game.comments && (
            <Box className="additional-container">
              <p>{game.comments}</p>
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
}
