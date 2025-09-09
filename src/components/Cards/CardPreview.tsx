import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Skeleton } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import "../../assets/styles/CardPreview.scss";
import { ScryfallService } from "../../services/Scryfall";
import { CardUris } from "../../state/CardUris";
import { DeckCardDetails } from "../../state/DeckDetails";

type OwnProps = {
  cards?: DeckCardDetails[];
  cardUris?: CardUris[];
  size?: "large" | "small";
  clickable?: boolean;
};

export function CardPreview({
  cards,
  cardUris,
  size = "large",
  clickable,
}: OwnProps) {
  const [fetchedUris, setFetchedUris] = useState<CardUris[]>(cardUris ?? []);
  const [flipped, setFlipped] = useState(false);
  const [showingIndex, setShowingIndex] = useState(0);

  const stackOffset = useMemo(() => {
    if (cards?.length && cards.length > 1) {
      return size === "large" ? 35 : 25;
    }

    return 0;
  }, [cards, size]);

  useEffect(() => {
    async function getCardDetails() {
      if (cards?.length) {
        const cardDetails = await Promise.all(
          cards.map(ScryfallService.getCardObjectByCode)
        );
        setFetchedUris(cardDetails);
      }
    }

    getCardDetails();
  }, [cards]);

  function handleClick() {
    if (fetchedUris?.[showingIndex]?.uri) {
      window.open(fetchedUris[showingIndex].uri, "_blank");
    }
  }

  function handleFlip() {
    setFlipped(!flipped);
  }

  if (!fetchedUris.length) {
    return (
      <div className={`card-preview ${size} offset`}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div
      className={`card-preview ${size} ${clickable ? "clickable" : ""} offset`}
    >
      <div className="card-stack">
        {fetchedUris.map((uri, index) => {
          const indexMultiplier = fetchedUris.length > 1 ? (index ? 1 : -1) : 0;
          const offset = fetchedUris.length > 1 ? stackOffset / 2 : 0;
          const indexedOffset = indexMultiplier * offset;
          const rotation = flipped ? 180 : 0;
          return (
            <div
              key={uri.uri}
              className="card-stack-card"
              style={{
                transform: `rotateY(${rotation}deg) translate(${indexedOffset}px, ${-indexedOffset}px)`,
                zIndex:
                  index === showingIndex ? 100 : fetchedUris.length - index,
              }}
            >
              <div className="card-preview-front">
                <img
                  src={uri.faceUris[0]}
                  onClick={clickable ? handleClick : undefined}
                  onMouseEnter={() => setShowingIndex(index)}
                  onMouseLeave={() => setShowingIndex(0)}
                />
              </div>
              <div className="card-preview-back">
                <img
                  src={uri.faceUris[1]}
                  onClick={clickable ? handleClick : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>
      {fetchedUris[showingIndex].faceUris.length > 1 && clickable && (
        <Button variant="surface" color="gray" onClick={handleFlip}>
          <FontAwesomeIcon icon={faRotate} />
          Flip
        </Button>
      )}
    </div>
  );
}
