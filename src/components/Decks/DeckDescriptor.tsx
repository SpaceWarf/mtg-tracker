import { Flex, Link, Text } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";

type OwnProps = {
  deck: DbDeck;
  version?: string;
};

export function DeckDescriptor({ deck, version }: OwnProps) {
  const versionIdx = deck.versions?.findIndex((v) => v.id === version) ?? -1;
  const nextVersion = deck.versions?.[versionIdx + 1]?.id;
  return (
    <Flex direction="column">
      <Link
        href={`/decks?decklist=${deck.id}&version=${nextVersion ?? "latest"}`}
        target="_blank"
      >
        {deck.name}{" "}
        <Text size="1" color="gray">
          {versionIdx === -1 ? "v1" : `v${versionIdx + 2}`}
        </Text>
      </Link>
      {deck.commander && (
        <Text size="1" color="gray">
          {deck.commander}
        </Text>
      )}
    </Flex>
  );
}
