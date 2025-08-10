import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  IconButton,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDecks } from "../../hooks/useDecks";
import { usePlayers } from "../../hooks/usePlayers";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import { GameService } from "../../services/Game";
import { DbGame, GamePlayer } from "../../state/Game";
import { isDateValid } from "../../utils/Date";
import { GamePlayerEditSection } from "./GamePlayerEditSection";

type OwnProps = {
  game: DbGame;
};

export function GameEditModal({ game }: OwnProps) {
  const navigate = useNavigate();
  const { dbPlayers } = usePlayers();
  const playerSelectOptions = useSelectOptions(dbPlayers ?? [], "id", "name");
  const { dbDecks } = useDecks();
  const deckSelectOptions = useSelectOptions(
    dbDecks ?? [],
    "id",
    "name",
    "commander"
  );
  const [date, setDate] = useState<string>(game.date);
  const [player1, setPlayer1] = useState<GamePlayer>(game.player1);
  const [player2, setPlayer2] = useState<GamePlayer>(game.player2);
  const [player3, setPlayer3] = useState<GamePlayer>(game.player3);
  const [player4, setPlayer4] = useState<GamePlayer>(game.player4);
  const [comments, setComments] = useState<string>(game.comments);

  async function handleSave() {
    const update: DbGame = {
      ...cloneDeep(game),
      date,
      player1,
      player2,
      player3,
      player4,
      comments,
    };
    await GameService.update(game.id, update);
    navigate(0);
  }

  async function handleDelete() {
    await GameService.delete(game.id);
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setDate(game.date);
      setPlayer1(game.player1);
      setPlayer2(game.player2);
      setPlayer3(game.player3);
      setPlayer4(game.player4);
      setComments(game.comments);
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <IconButton variant="soft">
          <Pencil1Icon width="18" height="18" />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Edit game</Dialog.Title>

        <div className="mb-5">
          <Heading className="mb-1" size="3">
            Date
          </Heading>
          <TextField.Root
            className="input-field"
            placeholder="Date…"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          ></TextField.Root>
        </div>

        <Grid columns="2" rows="2" width="auto" gap="5">
          <GamePlayerEditSection
            gamePlayer={player1}
            playerIndex={1}
            playerSelectOptions={playerSelectOptions}
            deckSelectOptions={deckSelectOptions}
            onChange={(update) => setPlayer1(update)}
          />
          <GamePlayerEditSection
            gamePlayer={player2}
            playerIndex={2}
            playerSelectOptions={playerSelectOptions}
            deckSelectOptions={deckSelectOptions}
            onChange={(update) => setPlayer2(update)}
          />
          <GamePlayerEditSection
            gamePlayer={player3}
            playerIndex={3}
            playerSelectOptions={playerSelectOptions}
            deckSelectOptions={deckSelectOptions}
            onChange={(update) => setPlayer3(update)}
          />
          <GamePlayerEditSection
            gamePlayer={player4}
            playerIndex={4}
            playerSelectOptions={playerSelectOptions}
            deckSelectOptions={deckSelectOptions}
            onChange={(update) => setPlayer4(update)}
          />
        </Grid>

        <div className="mt-5">
          <Heading className="mb-1" size="3">
            Comments
          </Heading>
          <TextArea
            placeholder="Comments…"
            value={comments}
            onChange={({ target }) => setComments(target.value)}
          />
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close onClick={handleDelete}>
            <Button color="red">Delete</Button>
          </Dialog.Close>
          <Flex gap="3">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close disabled={!isDateValid(date)} onClick={handleSave}>
              <Button>Save</Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
