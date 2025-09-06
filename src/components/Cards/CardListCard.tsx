import {
  MinusIcon,
  PlusIcon,
  SketchLogoIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { Flex, IconButton, Link, Text } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ScryfallService } from "../../services/Scryfall";
import { ArchidektReduxCardLayout } from "../../state/ArchidektReduxData";
import { CardUris } from "../../state/CardUris";
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
  const [cardUris, setCardUris] = useState<CardUris>();
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
    if (cardUris) {
      const reversed =
        flipped &&
        [
          ArchidektReduxCardLayout.MODAL_DFC as string,
          ArchidektReduxCardLayout.TRANSFORM as string,
          ArchidektReduxCardLayout.REVERSIBLE_CARD as string,
        ].includes(card.layout);
      return cardUris.faceUris[reversed ? 1 : 0];
    }

    return "";
  }, [card, cardUris, flipped]);

  async function handleHover() {
    setHovering(true);

    if (!cardUris) {
      try {
        const cardUris = await ScryfallService.getCardObjectByCode(card);
        setCardUris(cardUris);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleLeave() {
    setHovering(false);
  }

  function getCastingCostWidth(castingCost: string) {
    const iconSizes: number[] = castingCost.split(",").map((symbol) => {
      if (symbol === "") {
        return 0;
      }
      if (symbol === "/") {
        return 8;
      }
      return 14;
    });
    const marginSize = (iconSizes.length - 1) * 3;
    return iconSizes.reduce((acc, size) => acc + size, 0) + marginSize;
  }

  return (
    <div>
      <Flex
        className="h-6 border-solid border-t border-gray-600"
        align="center"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        style={{
          cursor: cardUris ? "default" : "wait",
        }}
      >
        <Flex gap="1" align="center" mr="1">
          {diffType === DiffType.ADDED && (
            <PlusIcon color="green" width="14" height="14" />
          )}
          {diffType === DiffType.REMOVED && (
            <MinusIcon color="red" width="14" height="14" />
          )}
          <Text size="2">{card.qty}</Text>
        </Flex>
        <Flex align="center" overflow="hidden" mr="1">
          {cardUris ? (
            <Link
              className="overflow-hidden whitespace-nowrap overflow-ellipsis"
              size="2"
              href={cardUris.uri}
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
        </Flex>
        <Flex align="center" mr="1" gap="1" flexGrow="1">
          {gameChangerType !== GameChangerType.NONE && (
            <>
              {gameChangerType === GameChangerType.WOTC && (
                <div>
                  <SketchLogoIcon width="14" height="14" />
                </div>
              )}
              {gameChangerType === GameChangerType.IN_HOUSE && (
                <div>
                  <SketchLogoIcon color="orange" width="14" height="14" />
                </div>
              )}
            </>
          )}
          {card.tutor && (
            <img src={"/img/icons/tutor.svg"} width="14" height="14" />
          )}
          {card.extraTurns && (
            <img src={"/img/icons/extra-turn.svg"} width="14" height="14" />
          )}
          {card.massLandDenial && (
            <img src={"/img/icons/land-denial.svg"} width="14" height="14" />
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
        <Flex
          justify="end"
          align="center"
          gap="3px"
          width={`${getCastingCostWidth(card.castingCost)}px`}
          flexShrink="0"
        >
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
        cardUris &&
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
