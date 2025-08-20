import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { GamePlayer } from "../../state/Game";
import { DeckDescriptor } from "../Decks/DeckDescriptor";
import { GameStartIcon } from "../Icons/GameStartIcon";
import { GameWonIcon } from "../Icons/GameWonIcon";
import { SolRingIcon } from "../Icons/SolRingIcon";

type OwnProps = {
  player: GamePlayer;
};

export function GamePlayerSection({ player }: OwnProps) {
  return (
    <div>
      <Flex gap="10px" align="start">
        <Avatar
          className="mt-1"
          src={`/img/pfp/${player.player}.webp`}
          fallback={<FontAwesomeIcon icon={faUser} />}
          radius="full"
        />
        <Flex direction="column">
          <Flex align="center" gap="2">
            <Text>{player.playerObj?.name ?? ""}</Text>
            {player.won && <GameWonIcon />}
            {player.t1SolRing && <SolRingIcon />}
            {player.started && <GameStartIcon />}
          </Flex>
          {player.deckObj && (
            <DeckDescriptor
              deck={player.deckObj}
              version={player.deckVersion}
            />
          )}
        </Flex>
      </Flex>
    </div>
  );
}
