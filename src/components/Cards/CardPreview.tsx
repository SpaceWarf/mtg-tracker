import { useEffect, useState } from "react";
import "../../assets/styles/CardPreview.scss";
import { ScryfallService } from "../../services/Scryfall";
import { CardUris } from "../../state/CardUris";
import { DeckCardDetails } from "../../state/DeckDetails";

type OwnProps = {
  card?: DeckCardDetails;
  cardUris?: CardUris;
  size?: "large" | "small";
  clickable?: boolean;
};

export function CardPreview({
  card,
  cardUris,
  size = "large",
  clickable,
}: OwnProps) {
  const [fetchedUris, setFetchedUris] = useState<CardUris | undefined>(
    cardUris
  );

  useEffect(() => {
    async function getCardDetails() {
      if (card) {
        const cardDetails = await ScryfallService.getCardObjectByCode(card);
        setFetchedUris(cardDetails);
      }
    }

    getCardDetails();
  }, [card]);

  function handleClick() {
    if (fetchedUris?.uri) {
      window.open(fetchedUris.uri, "_blank");
    }
  }

  return (
    <img
      className={`card-preview ${size} ${clickable ? "clickable" : ""}`}
      src={fetchedUris?.faceUris[0]}
      onClick={clickable ? handleClick : undefined}
    />
  );
}
