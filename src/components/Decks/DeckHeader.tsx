import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import { getDeckDescriptorString } from "../../utils/Deck";
import { ManaIcon } from "../Icons/ManaIcon";

interface OwnProps {
  deck: DeckWithStats;
  size?: "large" | "small";
}

export function DeckHeader({ deck, size = "large" }: OwnProps) {
  return (
    <Flex gap="2" align="center">
      <Avatar
        src={deck.featured}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="full"
        size={size === "large" ? "6" : "5"}
      />
      <Flex direction="column">
        <Flex gap="1" align="center">
          <Text style={{ lineHeight: "1" }}>
            <b>{deck.name}</b>
          </Text>
          <Text size="1" color="gray">
            v{(deck.versions?.length ?? 0) + 1}
          </Text>
        </Flex>
        {deck.commander && <span className="text-sm">{deck.commander}</span>}
        {deck.externalId && (
          <>
            <Text size="1" color="gray">
              {getDeckDescriptorString(deck)}
            </Text>
            <Flex className="mt-1" gap="1">
              {!deck.colourIdentity?.length && (
                <ManaIcon colour="C" size={size} />
              )}
              {deck.colourIdentity
                ?.sort((a, b) => {
                  const sortOrder = ["White", "Blue", "Black", "Red", "Green"];
                  return sortOrder.indexOf(a) - sortOrder.indexOf(b);
                })
                .map((colour) => (
                  <ManaIcon key={colour} colour={colour} size={size} />
                ))}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
