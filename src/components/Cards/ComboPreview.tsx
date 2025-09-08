import { Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import "../../assets/styles/ComboPreview.scss";
import { ScryfallService } from "../../services/Scryfall";
import { CardUris } from "../../state/CardUris";
import { Combo } from "../../state/Combo";
import { CardPreview } from "./CardPreview";

type OwnProps = {
  combo: Combo;
};

export function ComboPreview({ combo }: OwnProps) {
  const [cardsUris, setCardsUris] = useState<CardUris[]>([]);

  useEffect(() => {
    async function getCardsUris() {
      const cardsUris = await Promise.all(
        combo.cards.map(ScryfallService.getCardObjectByName)
      );
      setCardsUris(cardsUris);
    }
    getCardsUris();
  }, [combo.cards]);

  function handleClick() {
    window.open(`https://edhrec.com${combo.href}`, "_blank");
  }

  return (
    <div className="combo-preview" onClick={handleClick}>
      <Flex direction="column" gap="1" align="center">
        <p className="combo-name">{combo.name.split(" (")[0]}</p>
        <Flex gap="1" align="center" mt="1">
          {cardsUris.map((cardUris) => (
            <CardPreview
              key={cardUris.uri}
              cardUris={[cardUris]}
              size="small"
            />
          ))}
        </Flex>
      </Flex>
    </div>
  );
}
