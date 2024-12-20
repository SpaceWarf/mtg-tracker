import { Flex, Heading, Select, Switch, Text } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useDecks } from "../../hooks/useDecks";
import { usePlayers } from "../../hooks/usePlayers";
import { GamePlayer } from "../../state/Game";

type OwnProps = {
  gamePlayer: GamePlayer;
  playerIndex: number;
  onChange: (update: GamePlayer) => void;
};

export function GamePlayerEditSection({
  gamePlayer,
  playerIndex,
  onChange,
}: OwnProps) {
  const { dbPlayers } = usePlayers();
  const { dbDecks } = useDecks();

  function handlePlayerChange(value: string) {
    const update: GamePlayer = {
      ...cloneDeep(gamePlayer),
      player: value,
    };
    delete update.playerObj;
    onChange(update);
  }

  function handleDeckChange(value: string) {
    const update: GamePlayer = {
      ...cloneDeep(gamePlayer),
      deck: value,
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
        <Select.Root
          value={gamePlayer.player}
          onValueChange={handlePlayerChange}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              {dbPlayers
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((player) => (
                  <Select.Item key={player.id} value={player.id}>
                    {player.name}
                  </Select.Item>
                ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root value={gamePlayer.deck} onValueChange={handleDeckChange}>
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              {dbDecks
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((deck) => (
                  <Select.Item key={deck.id} value={deck.id}>
                    {deck.name} ({deck.commander})
                  </Select.Item>
                ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
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
