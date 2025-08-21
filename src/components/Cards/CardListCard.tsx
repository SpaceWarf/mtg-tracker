import {
  MinusIcon,
  PlusIcon,
  SketchLogoIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { Flex, IconButton, Link, Text } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ScryfallCardObject, ScryfallService } from "../../services/Scryfall";
import { ArchidektReduxCardLayout } from "../../state/ArchidektReduxData";
import { DeckCardDetails } from "../../state/DeckDetails";
import { DiffType } from "../../state/DiffType";
import { GameChangerType } from "../../state/GameChangerType";
import { MousePosition } from "../../state/MousePosition";
import { ManaIcon } from "../Icons/ManaIcon";

type OwnProps = {
  card: DeckCardDetails;
  mousePosition: MousePosition;
  gameChangers?: DeckCardDetails[];
  diffType?: DiffType;
};

export function CardListCard({
  card,
  mousePosition,
  gameChangers,
  diffType,
}: OwnProps) {
  const [cardObject, setCardObject] = useState<ScryfallCardObject>();
  const [hovering, setHovering] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const gameChangerType = useMemo(() => {
    const isInHouse = gameChangers?.some((gc) => gc.name === card.name);
    if (card.gameChanger) {
      return GameChangerType.WOTC;
    }

    if (isInHouse) {
      return GameChangerType.IN_HOUSE;
    }

    return GameChangerType.NONE;
  }, [card, gameChangers]);

  const flippableCardLayouts = [
    ArchidektReduxCardLayout.MODAL_DFC as string,
    ArchidektReduxCardLayout.TRANSFORM as string,
    ArchidektReduxCardLayout.REVERSIBLE_CARD as string,
    ArchidektReduxCardLayout.FLIP as string,
    ArchidektReduxCardLayout.SPLIT as string,
  ];

  const transformRotation = useMemo(() => {
    if (flipped) {
      if (card.layout === ArchidektReduxCardLayout.FLIP) {
        return "180deg";
      }

      if (card.layout === ArchidektReduxCardLayout.SPLIT) {
        return "-90deg";
      }
    }
    return "0deg";
  }, [flipped, card.layout]);

  const thumbnail: string = useMemo(() => {
    if (cardObject?.image_uris) {
      return cardObject.image_uris.border_crop;
    }

    if (cardObject?.card_faces?.length) {
      const reversed =
        flipped &&
        [
          ArchidektReduxCardLayout.MODAL_DFC as string,
          ArchidektReduxCardLayout.TRANSFORM as string,
          ArchidektReduxCardLayout.REVERSIBLE_CARD as string,
        ].includes(card.layout);
      return cardObject.card_faces[reversed ? 1 : 0].image_uris.border_crop;
    }

    return "";
  }, [card, cardObject, flipped]);

  async function handleHover() {
    setHovering(true);

    if (!cardObject) {
      try {
        const cardObject = await ScryfallService.getCardObject(card);
        setCardObject(cardObject);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleLeave() {
    setHovering(false);
  }

  return (
    <div>
      <Flex
        className="h-6 border-solid border-t border-gray-600"
        justify="between"
        align="center"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        style={{
          cursor: cardObject ? "default" : "wait",
        }}
      >
        <Flex gap="1" align="center">
          {diffType === DiffType.ADDED && (
            <PlusIcon color="green" width="14" height="14" />
          )}
          {diffType === DiffType.REMOVED && (
            <MinusIcon color="red" width="14" height="14" />
          )}
          <Text size="2">{card.qty}</Text>
          <Flex className="w-48" gap="1" align="center">
            {cardObject ? (
              <Link
                className="overflow-hidden whitespace-nowrap overflow-ellipsis"
                size="2"
                href={cardObject.scryfall_uri}
                target="_blank"
              >
                <Text>{card.name}</Text>
              </Link>
            ) : (
              <Text
                className="overflow-hidden whitespace-nowrap overflow-ellipsis"
                size="2"
              >
                {card.name}
              </Text>
            )}
            {gameChangerType !== GameChangerType.NONE && (
              <>
                {gameChangerType === GameChangerType.WOTC && (
                  <div className="mr-1">
                    <SketchLogoIcon width="14" height="14" />
                  </div>
                )}
                {gameChangerType === GameChangerType.IN_HOUSE && (
                  <div className="mr-1">
                    <SketchLogoIcon color="orange" width="14" height="14" />
                  </div>
                )}
              </>
            )}
            {flippableCardLayouts.includes(card.layout) && (
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                onClick={() => setFlipped(!flipped)}
              >
                <UpdateIcon width="14" height="14" />
              </IconButton>
            )}
          </Flex>
        </Flex>
        <Flex align="center" gap="1">
          {card.castingCost.split(",").map((cost, index) => (
            <ManaIcon
              key={`${card.name}-${cost}-${index}`}
              colour={cost}
              size="small"
            />
          ))}
        </Flex>
      </Flex>
      {hovering &&
        cardObject &&
        createPortal(
          <div
            className="thumbnail-tooltip"
            style={{
              top:
                mousePosition.distanceToBottom <= 300
                  ? mousePosition.y - 300
                  : mousePosition.y + 20,
              left:
                mousePosition.distanceToRight <= 250
                  ? mousePosition.x - 210
                  : mousePosition.x + 20,
              transform: `rotate(${transformRotation})`,
            }}
          >
            <img src={thumbnail} />
          </div>,
          document.body
        )}
    </div>
  );
}
