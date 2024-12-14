import { Avatar, Flex } from "@radix-ui/themes";
import { GamePlayer } from "../state/Game";
import { DeckDescriptor } from "./DeckDescriptor";
import { GameStartIcon } from "./GameStartIcon";
import { GameWonIcon } from "./GameWonIcon";
import { SolRingIcon } from "./SolRingIcon";

type OwnProps = {
  player: GamePlayer;
};

export function GamePlayerSection({ player }: OwnProps) {
  return (
    <div>
      <Flex gap="10px" align="center">
        <Avatar
          src={`/src/assets/img/pfp/${player.player}.webp`}
          fallback="A"
          radius="full"
        />
        <Flex direction="column">
          <Flex align="center" gap="2">
            <p>{player.playerObj?.name ?? ""}</p>
            {player.won && <GameWonIcon />}
            {player.started && <GameStartIcon />}
            {player.t1SolRing && <SolRingIcon />}
          </Flex>
          {player.deckObj && <DeckDescriptor deck={player.deckObj} />}
        </Flex>
      </Flex>
    </div>
  );
}
