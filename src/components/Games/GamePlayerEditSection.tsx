import { Flex, Switch } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { GamePlayer } from "../../state/Game";
import { DeckSelect } from "../Common/Select/DeckSelect";
import { PlayerSelect } from "../Common/Select/PlayerSelect";
import { VersionSelect } from "../Common/Select/VersionSelect";

type OwnProps = {
  gamePlayer: GamePlayer;
  playerIndex: number;
  invertDropdownLayout?: boolean;
  onChange: (update: GamePlayer) => void;
};

export function GamePlayerEditSection({
  gamePlayer,
  playerIndex,
  invertDropdownLayout,
  onChange,
}: OwnProps) {
  function handlePlayerChange(value: string) {
    const update: GamePlayer = {
      ...cloneDeep(gamePlayer),
      player: value,
    };
    delete update.playerObj;
    onChange(update);
  }

  function handleDeckChange(value: string, version?: string) {
    const update: GamePlayer = {
      ...cloneDeep(gamePlayer),
      deck: value,
      deckVersion: version ? version : "initial",
    };
    delete update.deckObj;
    onChange(update);
  }

  function handleDeckVersionChange(value: string) {
    const update: GamePlayer = {
      ...cloneDeep(gamePlayer),
      deckVersion: value,
    };
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
      <p className="field-label mb-1">
        <b>Player {playerIndex}</b>
      </p>
      <Flex direction="column" gap="3">
        <PlayerSelect
          value={gamePlayer.player}
          onChange={handlePlayerChange}
          isMulti={false}
          clearable={false}
        />
        <Flex gap="3">
          <Flex width="65%" flexGrow="1">
            <div className="w-full">
              <DeckSelect
                value={gamePlayer.deck}
                onChange={handleDeckChange}
                isMulti={false}
                menuPlacement={invertDropdownLayout ? "top" : "bottom"}
                clearable={false}
              />
            </div>
          </Flex>
          {gamePlayer.deck && (
            <Flex width="35%" flexGrow="1">
              <div className="w-full">
                <VersionSelect
                  deckId={gamePlayer.deck}
                  value={gamePlayer.deckVersion ?? "initial"}
                  onChange={handleDeckVersionChange}
                  isMulti={false}
                  menuPlacement={invertDropdownLayout ? "top" : "bottom"}
                />
              </div>
            </Flex>
          )}
        </Flex>
        <Flex gap="3">
          <Flex gap="2" align="center">
            <Switch
              size="1"
              checked={gamePlayer.won}
              onClick={handleWonChange}
            />{" "}
            Won?
          </Flex>
          <Flex gap="2" align="center">
            <Switch
              size="1"
              checked={gamePlayer.t1SolRing}
              onClick={handleT1SolRingChange}
            />{" "}
            Sol Ring?
          </Flex>
          <Flex gap="2" align="center">
            <Switch
              size="1"
              checked={gamePlayer.started}
              onClick={handleStartedChange}
            />{" "}
            Started?
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
