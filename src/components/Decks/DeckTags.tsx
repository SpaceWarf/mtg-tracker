import { Badge, Flex, Tooltip } from "@radix-ui/themes";
import { useMemo } from "react";
import "../../assets/styles/DeckTags.scss";
import { Bracket } from "../../state/Bracket";
import { DeckWithStats } from "../../state/Deck";
import { Format, FORMAT_LABELS } from "../../state/Format";
import {
  getBracket,
  getBracketDetails,
  getBracketName,
} from "../../utils/Bracket";
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

  const bracket = useMemo(() => {
    return getBracket(deck);
  }, [deck]);

  const bracketLabel = useMemo(() => {
    return getBracketName(bracket);
  }, [bracket]);

  const bracketDetails = useMemo(() => getBracketDetails(deck), [deck]);

  return (
    <Flex className="deck-tags" gap="2" wrap="wrap">
      {deck.externalId && (
        <>
          {deck.format && <Badge size="3">{formatLabel}</Badge>}
          {deck.colourIdentity && <Badge size="3">{colourIdentityLabel}</Badge>}
          {bracketLabel && bracket === Bracket.ILLEGAL && (
            <Tooltip
              content={bracketDetails.map((detail) => (
                <p key={detail} className="bracket-detail mb-1">
                  {detail}
                </p>
              ))}
            >
              <Badge className="error" size="3">
                {bracketLabel}
              </Badge>
            </Tooltip>
          )}
          {bracketLabel && bracket !== Bracket.ILLEGAL && (
            <Badge size="3">{bracketLabel}</Badge>
          )}
        </>
      )}
      {!deck.externalId && <Badge size="3">Unsynced</Badge>}
    </Flex>
  );
}
