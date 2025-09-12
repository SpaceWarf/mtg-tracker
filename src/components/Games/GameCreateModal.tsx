import {
  Button,
  Dialog,
  Flex,
  Grid,
  IconButton,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { GameService } from "../../services/Game";
import { Game, GamePlayer } from "../../state/Game";
import { getShortDateString, isDateValid } from "../../utils/Date";
import { Icon } from "../Common/Icon";
import { GamePlayerEditSection } from "./GamePlayerEditSection";

export function GameCreateModal() {
  const navigate = useNavigate();
  const { windowWidth } = useWindowDimensions();

  const newGamePlayer: GamePlayer = {
    player: "",
    deck: "",
    started: false,
    t1SolRing: false,
    won: false,
  };

  const [date, setDate] = useState<string>(getShortDateString(new Date()));
  const [player1, setPlayer1] = useState<GamePlayer>(cloneDeep(newGamePlayer));
  const [player2, setPlayer2] = useState<GamePlayer>(cloneDeep(newGamePlayer));
  const [player3, setPlayer3] = useState<GamePlayer>(cloneDeep(newGamePlayer));
  const [player4, setPlayer4] = useState<GamePlayer>(cloneDeep(newGamePlayer));
  const [comments, setComments] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);

  async function handleCreateOne() {
    await handleCreate();
    navigate(0);
  }

  async function handleCreate() {
    setCreating(true);
    const update: Game = {
      date,
      player1,
      player2,
      player3,
      player4,
      comments,
    };
    await GameService.create(update);
    setCreating(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setDate(getShortDateString(new Date()));
      setPlayer1(cloneDeep(newGamePlayer));
      setPlayer2(cloneDeep(newGamePlayer));
      setPlayer3(cloneDeep(newGamePlayer));
      setPlayer4(cloneDeep(newGamePlayer));
      setComments("");
      setCreating(false);
    }
  }

  function isValidPlayer(player: GamePlayer): boolean {
    return !!player.player && !!player.deck;
  }

  function canCreate(): boolean {
    return (
      !creating &&
      isDateValid(date) &&
      isValidPlayer(player1) &&
      isValidPlayer(player2) &&
      isValidPlayer(player3) &&
      isValidPlayer(player4)
    );
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        {windowWidth > 520 ? (
          <Button className="h-10" variant="soft">
            <Icon icon="plus" />
            Create
          </Button>
        ) : (
          <IconButton className="h-10 w-10" variant="soft">
            <Icon icon="plus" />
          </IconButton>
        )}
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content maxWidth="700px">
        <Dialog.Title>Create game</Dialog.Title>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Date</b>
          </p>
          <TextField.Root
            className="input-field"
            placeholder="Date…"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          ></TextField.Root>
        </div>

        <Grid columns={{ initial: "1", sm: "2" }} gap="5">
          <GamePlayerEditSection
            gamePlayer={player1}
            playerIndex={1}
            onChange={(update) => setPlayer1(update)}
          />
          <GamePlayerEditSection
            gamePlayer={player2}
            playerIndex={2}
            onChange={(update) => setPlayer2(update)}
          />
          <GamePlayerEditSection
            gamePlayer={player3}
            playerIndex={3}
            onChange={(update) => setPlayer3(update)}
            invertDropdownLayout
          />
          <GamePlayerEditSection
            gamePlayer={player4}
            playerIndex={4}
            onChange={(update) => setPlayer4(update)}
            invertDropdownLayout
          />
        </Grid>

        <div className="mt-5 mb-4">
          <p className="field-label mb-1">
            <b>Comments</b>
          </p>
          <TextArea
            className="area-field"
            placeholder="Comments…"
            value={comments}
            onChange={({ target }) => setComments(target.value)}
          />
        </div>

        <Flex gap="3" justify="between">
          <Dialog.Close>
            {windowWidth > 520 ? (
              <Button className="h-10" variant="outline">
                <Icon icon="xmark" /> Cancel
              </Button>
            ) : (
              <IconButton className="h-10 w-10" variant="outline">
                <Icon icon="xmark" />
              </IconButton>
            )}
          </Dialog.Close>
          <Flex gap="3">
            {windowWidth > 520 ? (
              <>
                <Dialog.Close disabled={!canCreate()} onClick={handleCreateOne}>
                  <Button className="h-10">
                    <Icon icon="check" />
                    Create One
                  </Button>
                </Dialog.Close>
                <Button
                  className="h-10"
                  disabled={!canCreate()}
                  onClick={handleCreate}
                  loading={creating}
                >
                  <Icon icon="forward" />
                  Create More
                </Button>
              </>
            ) : (
              <>
                <Dialog.Close disabled={!canCreate()} onClick={handleCreateOne}>
                  <IconButton className="h-10 w-10">
                    <Icon icon="check" />
                  </IconButton>
                </Dialog.Close>
                <IconButton
                  className="h-10 w-10"
                  disabled={!canCreate()}
                  onClick={handleCreate}
                  loading={creating}
                >
                  <Icon icon="forward" />
                </IconButton>
              </>
            )}
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
