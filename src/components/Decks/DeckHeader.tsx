import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Avatar, Flex, Text, Tooltip } from "@radix-ui/themes";
import { useMemo } from "react";
import { Bracket } from "../../state/Bracket";
import { DeckWithStats } from "../../state/Deck";
import { getBracket, getBracketDetails } from "../../utils/Bracket";
import { getDeckDescriptorString } from "../../utils/Deck";
import { ManaIcon } from "../Icons/ManaIcon";

interface OwnProps {
  deck: DeckWithStats;
  size?: "large" | "small";
}

export function DeckHeader({ deck, size = "large" }: OwnProps) {
  const bracket = useMemo(() => getBracket(deck), [deck]);
  const descriptor = useMemo(() => getDeckDescriptorString(deck), [deck]);
  const bracketDetails = useMemo(() => getBracketDetails(deck), [deck]);

  return (
    <Flex gap="2" align="center">
      <Avatar
        src={deck.featured}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="full"
        size={size === "large" ? "6" : "5"}
      />
      <Flex direction="column">
        <Text style={{ lineHeight: "1" }}>
          <b>{deck.name}</b>{" "}
          <Text size="1" color="gray">
            v{(deck.versions?.length ?? 0) + 1}
          </Text>
        </Text>
        {deck.commander && <span className="text-sm">{deck.commander}</span>}
        {deck.externalId && (
          <>
            {bracketDetails.length > 0 ? (
              <Flex align="center" gap="1">
                <Tooltip
                  content={
                    <ul>
                      {bracketDetails.map((detail) => (
                        <li key={detail}>
                          <Text size="2">{detail}</Text>
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <Text
                    size="1"
                    color={bracket === Bracket.ILLEGAL ? "red" : "gray"}
                  >
                    {descriptor}
                  </Text>
                </Tooltip>
                {!deck.bracket && (
                  <Tooltip content="The bracket was automatically determined by the app and may be inaccurate.">
                    <InfoCircledIcon width="12" height="12" color="gray" />
                  </Tooltip>
                )}
              </Flex>
            ) : (
              <Flex align="center" gap="1">
                <Text
                  size="1"
                  color={bracket === Bracket.ILLEGAL ? "red" : "gray"}
                >
                  {descriptor}
                </Text>
                {!deck.bracket && (
                  <Tooltip content="The bracket was automatically determined by the app and may be inaccurate.">
                    <InfoCircledIcon width="12" height="12" color="gray" />
                  </Tooltip>
                )}
              </Flex>
            )}
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
