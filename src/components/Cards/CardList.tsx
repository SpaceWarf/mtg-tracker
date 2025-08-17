import { Flex } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useDecks } from "../../hooks/useDecks";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { CARD_SORT_FCTS } from "../../state/CardSortFcts";
import { CategoryCardList } from "../../state/CategoryCardList";
import { DeckCardDetails, DeckCategoryDetails } from "../../state/DeckDetails";
import { MousePosition } from "../../state/MousePosition";
import { CardListCategory } from "./CardListCategory";

type OwnProps = {
  groupBy: CardGroupBy;
  sortBy: CardSortFctKey;
  search: string;
  cards: DeckCardDetails[];
  categories: DeckCategoryDetails[];
  columnCount?: number;
};

export function CardList({
  groupBy,
  sortBy,
  search,
  cards,
  categories,
  columnCount = 4,
}: OwnProps) {
  const { dbDecks } = useDecks();
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    distanceToBottom: 0,
  });

  const gameChangers = useMemo(() => {
    return dbDecks?.find((deck) => deck.gameChangersDeck)?.cards;
  }, [dbDecks]);

  const sortedCategories = useMemo(() => {
    const premierCategories = (categories ?? []).filter(
      (category) => category.isPremier && category.includedInDeck
    );
    const outOfDeckCategories = (categories ?? []).filter(
      (category) => !category.includedInDeck
    );
    let regularCategories: DeckCategoryDetails[] = [];

    switch (groupBy) {
      case CardGroupBy.CATEGORY:
        regularCategories = (categories ?? []).filter(
          (category) => !category.isPremier && category.includedInDeck
        );
        break;
      case CardGroupBy.TYPE:
        regularCategories = [
          ...new Set(cards?.map((card) => card.types.split(",")).flat()),
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
          cards
            ?.filter((card) => {
              const isSearched = search
                ? card.name.toLowerCase().includes(search.toLowerCase())
                : true;
              switch (groupBy) {
                case CardGroupBy.CATEGORY:
                  return card.category === category.name && isSearched;
                case CardGroupBy.TYPE:
                  if (category.isPremier) {
                    return card.category === category.name && isSearched;
                  } else {
                    return (
                      card.types.split(",")[0] === category.name &&
                      isSearched &&
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
  }, [categories, cards, groupBy, search, sortBy]);

  const categoryColumns: CategoryCardList[][] = useMemo(() => {
    return sortedCategories.reduce((acc, category, index) => {
      const colIndex = index % columnCount;
      if (acc[colIndex]) {
        acc[colIndex].push(category);
      } else {
        acc[colIndex] = [category];
      }
      return acc;
    }, [] as CategoryCardList[][]);
  }, [sortedCategories, columnCount]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const distanceToBottom = windowHeight - mouseY;
      setMousePosition({ x: e.clientX, y: e.clientY, distanceToBottom });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div>
      <Flex gap="5">
        {categoryColumns.map((column, index) => (
          <Flex
            key={index}
            direction="column"
            gap="5"
            flexBasis={`${100 / columnCount}%`}
          >
            {column.map((category) => (
              <CardListCategory
                key={category.category.id}
                category={category}
                mousePosition={mousePosition}
                gameChangers={gameChangers}
              />
            ))}
          </Flex>
        ))}
      </Flex>
    </div>
  );
}
