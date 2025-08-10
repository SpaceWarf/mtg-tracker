import { Flex, Heading, Switch, Text } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useMemo } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { GamePlayer } from "../../state/Game";
import { SelectOption } from "../../state/SelectOption";

type OwnProps = {
  gamePlayer: GamePlayer;
  playerIndex: number;
  playerSelectOptions: SelectOption[];
  deckSelectOptions: SelectOption[];
  onChange: (update: GamePlayer) => void;
};

export function GamePlayerEditSection({
  gamePlayer,
  playerIndex,
  playerSelectOptions,
  deckSelectOptions,
  onChange,
}: OwnProps) {
  const currentPlayerOption = useMemo(() => {
    return playerSelectOptions.find(
      (option) => option.value === gamePlayer.player
    );
  }, [gamePlayer.player, playerSelectOptions]);

  const currentDeckOption = useMemo(() => {
    return deckSelectOptions.find((option) => option.value === gamePlayer.deck);
  }, [gamePlayer.deck, deckSelectOptions]);

  function handlePlayerChange(option: SingleValue<SelectOption>) {
    if (!option) {
      return;
    }

    const update: GamePlayer = {
      ...cloneDeep(gamePlayer),
      player: option.value,
    };
    delete update.playerObj;
    onChange(update);
  }

  function handleDeckChange(option: SingleValue<SelectOption>) {
    if (!option) {
      return;
    }

    const update: GamePlayer = {
      ...cloneDeep(gamePlayer),
      deck: option.value,
    };
    delete update.deckObj;
    onChange(update);
  }

  function handleStartedChange() {
    onChange({
      ...cloneDeep(gamePlayer),
      started: !gamePlayer.started,
    });
  }

  function handleT1SolRingChange() {
    onChange({
      ...cloneDeep(gamePlayer),
      t1SolRing: !gamePlayer.t1SolRing,
    });
  }

  function handleWonChange() {
    onChange({
      ...cloneDeep(gamePlayer),
      won: !gamePlayer.won,
    });
  }

  return (
    <div>
      <Heading className="mb-1" size="3">
        Player {playerIndex}
      </Heading>
      <Flex direction="column" gap="3">
        <ReactSelect
          className="react-select-container min-w-60"
          classNamePrefix="react-select"
          name="player"
          options={playerSelectOptions}
          value={currentPlayerOption}
          onChange={handlePlayerChange}
        />
        <ReactSelect
          className="react-select-container min-w-60"
          classNamePrefix="react-select"
          name="deck"
          options={deckSelectOptions}
          value={currentDeckOption}
          onChange={handleDeckChange}
        />
        <Flex gap="3">
          <Text as="label" size="2">
            <Flex gap="2">
              <Switch
                size="1"
                checked={gamePlayer.won}
                onClick={handleWonChange}
              />{" "}
              Won?
            </Flex>
          </Text>
          <Text as="label" size="2">
            <Flex gap="2">
              <Switch
                size="1"
                checked={gamePlayer.t1SolRing}
                onClick={handleT1SolRingChange}
              />{" "}
              Sol Ring?
            </Flex>
          </Text>
          <Text as="label" size="2">
            <Flex gap="2">
              <Switch
                size="1"
                checked={gamePlayer.started}
                onClick={handleStartedChange}
              />{" "}
              Started?
            </Flex>
          </Text>
        </Flex>
      </Flex>
    </div>
  );
}
