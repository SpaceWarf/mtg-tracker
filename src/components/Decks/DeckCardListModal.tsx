import {
  ExternalLinkIcon,
  ListBulletIcon,
  SketchLogoIcon,
  StarFilledIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
} from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { ArchidektService } from "../../services/Archidekt";
import { ScryfallCardObject, ScryfallService } from "../../services/Scryfall";
import { CardGroupBy, CardGroupByOptions } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { CARD_SORT_FCTS } from "../../state/CardSortFcts";
import { DbDeck } from "../../state/Deck";
import { DeckCardDetails, DeckCategoryDetails } from "../../state/DeckDetails";
import { SelectOption } from "../../state/SelectOption";
import { SortFctType } from "../../state/SortFctType";
import { ManaIcon } from "../Icons/ManaIcon";
import { SortFctSelect } from "../Select/SortFctSelect";
import { DeckHeader } from "./DeckHeader";

type OwnProps = {
  deck: DbDeck;
};

interface CategoryCardList {
  category: DeckCategoryDetails;
  cards: DeckCardDetails[];
}

export function DeckCardListModal({ deck }: OwnProps) {
  const [open, setOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<SingleValue<SelectOption>>(
    CardGroupByOptions[CardGroupBy.CATEGORY]
  );
  const [sortBy, setSortBy] = useState<CardSortFctKey>(CardSortFctKey.NAME_ASC);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const sortedCategories = useMemo(() => {
    if (!open) {
      return [];
    }

    const premierCategories = (deck.categories ?? []).filter(
      (category) => category.isPremier && category.includedInDeck
    );
    const outOfDeckCategories = (deck.categories ?? []).filter(
      (category) => !category.includedInDeck
    );
    let regularCategories: DeckCategoryDetails[] = [];

    switch (groupBy?.value) {
      case CardGroupBy.CATEGORY:
        regularCategories = (deck.categories ?? []).filter(
          (category) => !category.isPremier && category.includedInDeck
        );
        break;
      case CardGroupBy.TYPE:
        regularCategories = [
          ...new Set(deck.cards?.map((card) => card.types.split(",")).flat()),
        ].map((type, index) => ({
          id: index,
          name: type,
          isPremier: false,
          includedInDeck: true,
          includedInPrice: true,
        }));
        break;
    }

    return [
      ...premierCategories.sort((a, b) => a.name.localeCompare(b.name)),
      ...regularCategories.sort((a, b) => a.name.localeCompare(b.name)),
    ]
      .map((category) => ({
        category,
        cards:
          deck.cards
            ?.filter((card) => {
              switch (groupBy?.value) {
                case CardGroupBy.CATEGORY:
                  return card.category === category.name;
                case CardGroupBy.TYPE:
                  if (category.isPremier) {
                    return card.category === category.name;
                  } else {
                    return (
                      card.types.split(",")[0] === category.name &&
                      [...premierCategories, ...outOfDeckCategories].every(
                        (category) => category.name !== card.category
                      )
                    );
                  }
                default:
                  return false;
              }
            })
            .sort(
              (a, b) =>
                CARD_SORT_FCTS[sortBy].sortFct(a, b) ||
                a.name.localeCompare(b.name)
            ) ?? [],
      }))
      .filter((category) => category.cards.length > 0);
  }, [deck, open, sortBy, groupBy]);

  const categoryColumns = useMemo(() => {
    if (!open) {
      return [];
    }

    return sortedCategories.reduce(
      (acc, category, index) => {
        acc[index % 4].push(category);
        return acc;
      },
      [
        [] as CategoryCardList[],
        [] as CategoryCardList[],
        [] as CategoryCardList[],
        [] as CategoryCardList[],
      ]
    );
  }, [sortedCategories, open]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button>
          <ListBulletIcon width="18" height="18" />
          Open Card List
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content maxWidth="1500px">
        <Flex className="mb-5" justify="between">
          <Flex gap="5">
            <Dialog.Title>
              <DeckHeader
                title={deck.name}
                commanders={deck.commander}
                featured={deck.featured ?? ""}
                colourIdentity={deck.colourIdentity ?? []}
              />
            </Dialog.Title>

            <div>
              <Heading className="mb-1" size="3">
                Group by
              </Heading>
              <ReactSelect
                className="react-select-container min-w-60"
                classNamePrefix="react-select"
                name="groupBySelect"
                options={Object.values(CardGroupByOptions)}
                value={groupBy}
                onChange={(value: SingleValue<SelectOption>) =>
                  setGroupBy(value)
                }
                menuPlacement="top"
              />
            </div>

            <div>
              <Heading className="mb-1" size="3">
                Sort by
              </Heading>
              <SortFctSelect
                type={SortFctType.CARD}
                value={sortBy}
                onChange={(value: string) => setSortBy(value as CardSortFctKey)}
              />
            </div>
          </Flex>
          <IconButton
            variant="soft"
            onClick={() =>
              window.open(
                ArchidektService.getDeckUrl(deck.externalId ?? ""),
                "_blank"
              )
            }
          >
            <ExternalLinkIcon width="18" height="18" />
          </IconButton>
        </Flex>

        <Flex gap="5">
          {categoryColumns.map((column, index) => (
            <Flex key={index} direction="column" gap="5" flexBasis="25%">
              {column.map((category) => (
                <CategoryListItem
                  key={category.category.id}
                  category={category}
                  mousePosition={mousePosition}
                />
              ))}
            </Flex>
          ))}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

type CategoryListProps = {
  category: CategoryCardList;
  mousePosition: { x: number; y: number };
};

export function CategoryListItem({
  category,
  mousePosition,
}: CategoryListProps) {
  return (
    <div key={category.category.id}>
      <Flex align="center" justify="between">
        <Flex gap="1" align="center">
          {category.category.isPremier && (
            <StarFilledIcon width="16" height="16" />
          )}
          <Heading size="3">{category.category.name}</Heading>
        </Flex>
        <Text className="text-gray-400" size="2">
          Qty: {category.cards.reduce((acc, card) => acc + card.qty, 0)}
        </Text>
      </Flex>
      {category.cards.map((card) => (
        <CardListItem
          key={card.name}
          card={card}
          mousePosition={mousePosition}
        />
      ))}
    </div>
  );
}

type CardListProps = {
  card: DeckCardDetails;
  mousePosition: { x: number; y: number };
};

export function CardListItem({ card, mousePosition }: CardListProps) {
  const [cardObject, setCardObject] = useState<ScryfallCardObject>();
  const [hovering, setHovering] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const thumbnail: string = useMemo(() => {
    if (cardObject?.image_uris) {
      return cardObject.image_uris.border_crop;
    }

    if (cardObject?.card_faces?.length) {
      return cardObject.card_faces[reversed ? 1 : 0].image_uris.border_crop;
    }

    return "";
  }, [cardObject, reversed]);

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
            {card.gameChanger && <SketchLogoIcon width="14" height="14" />}
            {card.canReverse && (
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                onClick={() => setReversed(!reversed)}
              >
                <UpdateIcon width="14" height="14" />
              </IconButton>
            )}
            {card.canFlip && (
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
          {card.castingCost.split(",").map((cost) => (
            <div>
              <ManaIcon colour={cost} size="small" />
            </div>
          ))}
        </Flex>
      </Flex>
      {hovering && cardObject && (
        <div
          className="thumbnail-tooltip"
          style={{
            top: mousePosition.y + 20,
            left: mousePosition.x + 20,
            transform: `rotate(${flipped ? "180deg" : "0deg"})`,
          }}
        >
          <img src={thumbnail} />
        </div>
      )}
    </div>
  );
}
