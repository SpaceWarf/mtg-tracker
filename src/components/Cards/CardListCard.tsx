import { Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "../../assets/styles/CardListCard.scss";
import { ScryfallService } from "../../services/Scryfall";
import { ArchidektReduxCardLayout } from "../../state/ArchidektReduxData";
import { CardUris } from "../../state/CardUris";
import { DeckCardDetails } from "../../state/DeckDetails";
import { DiffType } from "../../state/DiffType";
import { GameChangerType } from "../../state/GameChangerType";
import { MousePosition } from "../../state/MousePosition";
import { Icon } from "../Common/Icon";
import { ManaIcon } from "../Common/ManaIcon";

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
    <div className="card-list-card-container">
      <Flex
        className={`card-list-card ${cardUris ? "selectable" : ""}`}
        align="center"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        onClick={(e) => {
          e.stopPropagation();
          if (cardUris) {
            window.open(cardUris.uri, "_blank");
          }
        }}
      >
        <Flex gap="1" align="center" mr="1">
          {diffType === DiffType.ADDED && <Icon icon="plus" color="#5abe8c" />}
          {diffType === DiffType.REMOVED && (
            <Icon icon="minus" color="#d84242" />
          )}
          <p className="card-qty">{card.qty}</p>
        </Flex>
        <Flex align="center" overflow="hidden" mr="1">
          <p className="card-name">{card.name}</p>
        </Flex>
        <Flex align="center" mr="1" gap="1" flexGrow="1">
          {gameChangerType !== GameChangerType.NONE && (
            <>
              {gameChangerType === GameChangerType.WOTC && (
                <Tooltip content="WOTC Game Changer">
                  <Icon icon="gem" size="sm" />
                </Tooltip>
              )}
              {gameChangerType === GameChangerType.IN_HOUSE && (
                <Tooltip content="In-House Game Changer">
                  <Icon icon="gem" size="sm" color="#FA9F42" />
                </Tooltip>
              )}
            </>
          )}
          {card.tutor && (
            <Tooltip content="Tutor">
              <Icon icon="magnifying-glass-plus" size="sm" />
            </Tooltip>
          )}
          {card.extraTurns && (
            <Tooltip content="Extra Turn">
              <Icon icon="forward" size="sm" />
            </Tooltip>
          )}
          {card.massLandDenial && (
            <Tooltip content="Mass Land Denial">
              <Icon icon="bomb" size="sm" />
            </Tooltip>
          )}
          {flippableCardLayouts.includes(card.layout) && (
            <Tooltip content="Flip Card">
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(!flipped);
                }}
              >
                <Icon icon="rotate" size="sm" />
              </IconButton>
            </Tooltip>
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
