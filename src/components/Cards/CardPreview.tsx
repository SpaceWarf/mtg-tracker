import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Skeleton } from "@radix-ui/themes";
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
  const [flipped, setFlipped] = useState(false);

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
    return (
      <div className={`card-preview ${size}`}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`card-preview ${size} ${clickable ? "clickable" : ""}`}>
      <div
        className="card-preview-inner"
        style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
      >
        <div className="card-preview-front">
          <img
            src={fetchedUris.faceUris[0]}
            onClick={clickable ? handleClick : undefined}
          />
        </div>
        <div className="card-preview-back">
          <img
            src={fetchedUris.faceUris[1]}
            onClick={clickable ? handleClick : undefined}
          />
        </div>
      </div>
      {fetchedUris.faceUris.length > 1 && (
        <Button variant="surface" color="gray" onClick={handleFlip}>
          <FontAwesomeIcon icon={faRotate} />
          Flip
        </Button>
      )}
    </div>
  );
}
