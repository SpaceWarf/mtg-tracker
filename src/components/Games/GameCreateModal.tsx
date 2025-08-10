import { PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
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
import { Game, GamePlayer } from "../../state/Game";
import { getShortDateString, isDateValid } from "../../utils/Date";
import { GamePlayerEditSection } from "./GamePlayerEditSection";

export function GameCreateModal() {
  const { dbPlayers } = usePlayers();
  const playerSelectOptions = useSelectOptions(dbPlayers ?? [], "id", "name");
  const { dbDecks } = useDecks();
  const deckSelectOptions = useSelectOptions(
    dbDecks ?? [],
    "id",
    "name",
    "commander"
  );
  const navigate = useNavigate();
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
        <Button className="h-10 mt-6">
          <PlusIcon width="18" height="18" />
          Create new game
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Create game</Dialog.Title>

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
            invertDropdownLayout={true}
            onChange={(update) => setPlayer3(update)}
          />
          <GamePlayerEditSection
            gamePlayer={player4}
            playerIndex={4}
            playerSelectOptions={playerSelectOptions}
            deckSelectOptions={deckSelectOptions}
            invertDropdownLayout={true}
            onChange={(update) => setPlayer4(update)}
          />
        </Grid>

        <div className="mt-5">
          <Heading className="mb-1" size="3">
            Comments
          </Heading>
          <TextArea
            className="area-field"
            placeholder="Comments…"
            value={comments}
            onChange={({ target }) => setComments(target.value)}
          />
        </div>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close disabled={!canCreate()} onClick={handleCreateOne}>
            <Button>Create One</Button>
          </Dialog.Close>
          <Button
            disabled={!canCreate()}
            onClick={handleCreate}
            loading={creating}
          >
            Create More
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
