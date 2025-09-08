import { Flex } from "@radix-ui/themes";
import { DeckWithStats } from "../../state/Deck";
import { ManaIcon } from "../Icons/ManaIcon";

interface OwnProps {
  deck: DeckWithStats;
  size?: "large" | "small";
}

export function DeckColourIdentity({ deck, size = "large" }: OwnProps) {
  return (
    <Flex gap="1">
      {!deck.colourIdentity?.length && <ManaIcon colour="C" size={size} />}
      {deck.colourIdentity
        ?.sort((a, b) => {
          const sortOrder = ["White", "Blue", "Black", "Red", "Green"];
          return sortOrder.indexOf(a) - sortOrder.indexOf(b);
        })
        .map((colour) => (
          <ManaIcon key={colour} colour={colour} size={size} />
        ))}
    </Flex>
  );
}
