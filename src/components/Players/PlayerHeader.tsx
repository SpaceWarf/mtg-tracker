import { Avatar, Flex, Heading } from "@radix-ui/themes";
import { DbPlayer } from "../../state/Player";
import { Icon } from "../Common/Icon";

type OwnProps = {
  player: DbPlayer;
};

export function PlayerHeader({ player }: OwnProps) {
  return (
    <Flex gap="3" align="center">
      <Avatar
        src={`/img/pfp/${player.id}.webp`}
        fallback={<Icon icon="user" />}
        radius="full"
        size="5"
      />
      <Heading>{player.name}</Heading>
    </Flex>
  );
}
