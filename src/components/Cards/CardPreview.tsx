import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
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
  const [flipped, setFlipped] = useState(false);

  const faceUri = useMemo(() => {
    return fetchedUris?.faceUris[flipped ? 1 : 0];
  }, [fetchedUris, flipped]);

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

  function handleFlip() {
    setFlipped(!flipped);
  }

  if (!fetchedUris) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`card-preview ${size} ${clickable ? "clickable" : ""}`}>
      <img src={faceUri} onClick={clickable ? handleClick : undefined} />
      {fetchedUris.faceUris.length > 1 && (
        <Button variant="surface" color="gray" onClick={handleFlip}>
          <FontAwesomeIcon icon={faRotate} />
          Flip Card
        </Button>
      )}
    </div>
  );
}
