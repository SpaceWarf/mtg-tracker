import { Button, Flex, Skeleton } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import "../../assets/styles/CardPreview.scss";
import { ScryfallService } from "../../services/Scryfall";
import { CardUris } from "../../state/CardUris";
import { DeckCardDetails } from "../../state/DeckDetails";
import { Icon } from "../Common/Icon";

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
      <div className={`card-preview ${size}`}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <Flex
      className={`card-preview ${size} ${clickable ? "clickable" : ""}`}
      justify="center"
      style={{
        transform: `scale(${fetchedUris.length > 1 ? 0.9 : 1})`,
      }}
    >
      <div className="card-stack">
        {fetchedUris.map((uri, index) => {
          const indexMultiplier = fetchedUris.length > 1 ? (index ? 1 : -1) : 0;
          const offset = fetchedUris.length > 1 ? stackOffset / 2 : 0;
          const indexedOffset = Math.floor(indexMultiplier * offset);
          const rotation = flipped ? 180 : 0;
          console.log(indexedOffset);
          return (
            <div
              key={uri.uri}
              className="card-stack-card"
              style={{
                position: "absolute",
                transform: `rotateY(${rotation}deg) translate(${indexedOffset}px, ${-indexedOffset}px`,
                zIndex:
                  index === showingIndex ? 100 : fetchedUris.length - index,
              }}
            >
              <img
                className="card-preview-front"
                src={uri.faceUris[0]}
                onClick={clickable ? handleClick : undefined}
                onMouseEnter={() => setShowingIndex(index)}
                onMouseLeave={() => setShowingIndex(0)}
              />
              <img
                className="card-preview-back"
                src={uri.faceUris[1]}
                onClick={clickable ? handleClick : undefined}
              />
            </div>
          );
        })}
      </div>
      {fetchedUris[showingIndex].faceUris.length > 1 && clickable && (
        <Button variant="surface" color="gray" onClick={handleFlip}>
          <Icon icon="rotate" size="xs" />
          Flip
        </Button>
      )}
    </Flex>
  );
}
