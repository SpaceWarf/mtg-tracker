import { faInfinity } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Grid } from "@radix-ui/themes";
import { useMemo } from "react";
import "../../assets/styles/DeckCombosSections.scss";
import { DeckWithStats } from "../../state/Deck";
import { TWO_CARD_COMBO_LIMIT } from "../../utils/Bracket";
import { ComboPreview } from "../Cards/ComboPreview";
import { DataCard } from "../Common/DataCard";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckCombosSection({ deck }: OwnProps) {
  const early2CardCombos = useMemo(() => {
    return deck.combos.filter(
      (combo) => combo.cards.length === 2 && combo.bracket === "4-5"
    );
  }, [deck.combos]);

  const late2CardCombos = useMemo(() => {
    return deck.combos.filter(
      (combo) =>
        combo.cards.length === 2 && ["any", "3"].includes(combo.bracket)
    );
  }, [deck.combos]);

  const otherCombos = useMemo(() => {
    return deck.combos.filter((combo) => combo.cards.length !== 2);
  }, [deck.combos]);

  return (
    <DataCard
      className="deck-combos-card"
      title={`Combos (${deck.combos.length})`}
      icon={<FontAwesomeIcon icon={faInfinity} />}
      direction="column"
      error={early2CardCombos.length > TWO_CARD_COMBO_LIMIT}
    >
      {early2CardCombos.length > 0 && (
        <Flex width="100%" direction="column" gap="2">
          <div className="section-title-container">
            <p className="section-title">Early Game 2 Card Combos</p>
          </div>
          <Grid
            columns={{ initial: "1", sm: "2", md: "1", lg: "2" }}
            gap="5"
            mt="3"
          >
            {early2CardCombos.map((combo) => (
              <ComboPreview key={combo.name} combo={combo} />
            ))}
          </Grid>
        </Flex>
      )}
      {late2CardCombos.length > 0 && (
        <Flex width="100%" direction="column" gap="2" mt="5">
          <div className="section-title-container">
            <p className="section-title">Late Game 2 Card Combos</p>
          </div>
          <Grid
            columns={{ initial: "1", sm: "2", md: "1", lg: "2" }}
            gap="5"
            mt="3"
          >
            {late2CardCombos.map((combo) => (
              <ComboPreview key={combo.name} combo={combo} />
            ))}
          </Grid>
        </Flex>
      )}
      {otherCombos.length > 0 && (
        <Flex width="100%" direction="column" gap="2" mt="5">
          <div className="section-title-container">
            <p className="section-title">3+ Card Combos</p>
          </div>
          <Grid
            columns={{ initial: "1", sm: "2", md: "1", lg: "2" }}
            gap="5"
            mt="3"
          >
            {otherCombos.map((combo) => (
              <ComboPreview key={combo.name} combo={combo} />
            ))}
          </Grid>
        </Flex>
      )}
    </DataCard>
  );
}
