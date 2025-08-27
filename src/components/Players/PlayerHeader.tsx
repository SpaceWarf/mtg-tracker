import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Flex, Heading } from "@radix-ui/themes";
import { DbPlayer } from "../../state/Player";

type OwnProps = {
  player: DbPlayer;
};

export function PlayerHeader({ player }: OwnProps) {
  return (
    <Flex gap="3" align="center">
      <Avatar
        src={`/img/pfp/${player.id}.webp`}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="full"
        size="5"
      />
      <Heading>{player.name}</Heading>
    </Flex>
  );
}
