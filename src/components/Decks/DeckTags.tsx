import { Badge, Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import "../../assets/styles/DeckTags.scss";
import { DeckWithStats } from "../../state/Deck";
import { Format, FORMAT_LABELS } from "../../state/Format";
import { getBracket, getBracketName } from "../../utils/Bracket";
import { getColourIdentityLabel } from "../../utils/Deck";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckTags({ deck }: OwnProps) {
  const formatLabel = useMemo(() => {
    return FORMAT_LABELS[deck.format?.trim().toLowerCase() as Format];
  }, [deck.format]);

  const colourIdentityLabel = useMemo(() => {
    return getColourIdentityLabel(deck.colourIdentity ?? []);
  }, [deck.colourIdentity]);

  const bracketLabel = useMemo(() => {
    return getBracketName(getBracket(deck));
  }, [deck]);

  return (
    <Flex className="deck-tags" gap="2">
      {deck.externalId && (
        <>
          {deck.format && (
            <Badge color="gray" size="3">
              {formatLabel}
            </Badge>
          )}
          {deck.colourIdentity && (
            <Badge color="gray" size="3">
              {colourIdentityLabel}
            </Badge>
          )}
          {bracketLabel && (
            <Badge color="gray" size="3">
              {bracketLabel}
            </Badge>
          )}
        </>
      )}
      {!deck.externalId && (
        <Badge color="gray" size="3">
          Unsynced
        </Badge>
      )}
    </Flex>
  );
}
