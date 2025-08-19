import { Flex, Text } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";

type OwnProps = {
  deck: DbDeck;
  version?: string;
};

export function DeckDescriptor({ deck, version }: OwnProps) {
  const versionIdx = deck.versions?.findIndex((v) => v.id === version) ?? -1;
  return (
    <Flex direction="column">
      <Text>
        {deck.name}{" "}
        <Text size="1" color="gray">
          {versionIdx === -1 ? "v1" : `v${versionIdx + 2}`}
        </Text>
      </Text>
      {deck.commander && (
        <Text size="1" color="gray">
          {deck.commander}
        </Text>
      )}
    </Flex>
  );
}
