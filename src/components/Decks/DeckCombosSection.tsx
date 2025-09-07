import { faGem } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import "../../assets/styles/DeckCombosSections.scss";
import { DeckWithStats } from "../../state/Deck";
import { ComboPreview } from "../Cards/ComboPreview";

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
    <Flex className="data-card deck-combos-card" direction="column">
      <Flex className="title" align="center" gap="3" mb="5">
        <FontAwesomeIcon icon={faGem} />
        <p>Combos</p>
      </Flex>
      <Flex className="combos-container" direction="column" gap="2">
        {early2CardCombos.length > 0 && (
          <Flex className="combo-section" direction="column" gap="2">
            <div className="section-title-container">
              <p className="section-title">Early Game 2 Card Combos</p>
            </div>
            <Flex gap="7" wrap="wrap" mt="3">
              {early2CardCombos.map((combo) => (
                <ComboPreview key={combo.name} combo={combo} />
              ))}
            </Flex>
          </Flex>
        )}
        {late2CardCombos.length > 0 && (
          <Flex className="combo-section" direction="column" gap="2" mt="5">
            <div className="section-title-container">
              <p className="section-title">Late Game 2 Card Combos</p>
            </div>
            <Flex gap="7" wrap="wrap" mt="3">
              {late2CardCombos.map((combo) => (
                <ComboPreview key={combo.name} combo={combo} />
              ))}
            </Flex>
          </Flex>
        )}
        {otherCombos.length > 0 && (
          <Flex className="combo-section" direction="column" gap="2" mt="5">
            <div className="section-title-container">
              <p className="section-title">3+ Card Combos</p>
            </div>
            <Flex gap="7" wrap="wrap" mt="3">
              {otherCombos.map((combo) => (
                <ComboPreview key={combo.name} combo={combo} />
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
