import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Flex } from "@radix-ui/themes";
import { ManaIcon } from "../Icons/ManaIcon";

interface OwnProps {
  title: string;
  commanders: string;
  featured: string;
  colourIdentity: string[];
  size?: "large" | "small";
}

export function DeckHeader({
  title,
  commanders,
  featured,
  colourIdentity,
  size = "large",
}: OwnProps) {
  return (
    <Flex gap="2" align="center">
      <Avatar
        src={featured}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="full"
        size={size === "large" ? "6" : "5"}
      />
      <Flex direction="column">
        <span>
          <b>{title}</b>
        </span>
        <span className="text-sm">{commanders}</span>
        <Flex className="mt-1" gap="1">
          {colourIdentity.map((colour) => (
            <ManaIcon key={colour} colour={colour} size={size} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
