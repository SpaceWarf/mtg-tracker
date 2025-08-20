import { Flex, Tabs, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useDecks } from "../../hooks/useDecks";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { CARD_SORT_FCTS } from "../../state/CardSortFcts";
import { CategoryCardList } from "../../state/CategoryCardList";
import { DeckCardDetails, DeckCategoryDetails } from "../../state/DeckDetails";
import { DeckVersion } from "../../state/DeckVersion";
import { DiffType } from "../../state/DiffType";
import { MousePosition } from "../../state/MousePosition";
import { removeDuplicatesByKey } from "../../utils/Array";
import { getLongDateString } from "../../utils/Date";
import { getAggregatedCardDiff } from "../../utils/Deck";
import { CardListCategory } from "./CardListCategory";

type OwnProps = {
  groupBy: CardGroupBy;
  sortBy: CardSortFctKey;
  search: string;
  cards: DeckCardDetails[];
  categories: DeckCategoryDetails[];
  versions: DeckVersion[];
  columnCount?: number;
};

export function CardList({
  groupBy,
  sortBy,
  search,
  cards,
  categories,
  versions,
  columnCount = 5,
}: OwnProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbDecks } = useDecks();
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    distanceToBottom: 0,
  });
  const [versionId, setVersionId] = useState<string>("latest");

  const cardDiffFromLatest = useMemo(() => {
    return getAggregatedCardDiff(versions, versionId);
  }, [versionId, versions]);

  const gameChangers = useMemo(() => {
    return dbDecks?.find((deck) => deck.gameChangersDeck)?.cards;
  }, [dbDecks]);

  const addedCardsWithQuantities = useMemo(() => {
    return (
      cardDiffFromLatest?.added.map((diff) => ({
        ...diff.card,
        qty: diff.qty,
      })) ?? []
    );
  }, [cardDiffFromLatest]);

  const removedCardsWithQuantities = useMemo(() => {
    return (
      cardDiffFromLatest?.removed.map((diff) => ({
        ...diff.card,
        qty: diff.qty,
      })) ?? []
    );
  }, [cardDiffFromLatest]);

  const cardsWithDiff = useMemo(() => {
    return [...cards, ...removedCardsWithQuantities]
      .reduce((acc, card) => {
        const accMatchIdx = acc.findIndex(
          (accCard) => accCard.name === card.name
        );
        if (accMatchIdx !== -1) {
          return [
            ...acc.slice(0, accMatchIdx),
            {
              ...acc[accMatchIdx],
              qty: acc[accMatchIdx].qty + card.qty,
            },
            ...acc.slice(accMatchIdx + 1),
          ];
        }
        return [...acc, card];
      }, [] as DeckCardDetails[])
      .map((card) => {
        const match = addedCardsWithQuantities.find(
          (addedCard) => addedCard.name === card.name
        );
        if (match) {
          return {
            ...card,
            qty: card.qty - match.qty,
          };
        }
        return card;
      })
      .filter((card) => card.qty > 0);
  }, [cards, addedCardsWithQuantities, removedCardsWithQuantities]);

  const visibleCategories: DeckCategoryDetails[] = useMemo(() => {
    const deckCategories = categories.filter(
      (category) => category.includedInDeck && category.name !== "Sideboard"
    );
    const categoriesFromDiff =
      cardDiffFromLatest?.removed.map((diff) => {
        return {
          name: diff.card.category,
          isPremier: false,
          includedInDeck: true,
          includedInPrice: true,
        };
      }) ?? [];
    return removeDuplicatesByKey(
      [...deckCategories, ...categoriesFromDiff],
      "name"
    );
  }, [categories, cardDiffFromLatest]);

  const premierCategories: DeckCategoryDetails[] = useMemo(() => {
    return visibleCategories
      .filter((category) => category.isPremier)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [visibleCategories]);

  const populatedPremierCategories: CategoryCardList[] = useMemo(() => {
    return premierCategories.map((category) => ({
      category,
      cards: cardsWithDiff
        .filter((card) => {
          const isSearched = search
            ? card.name.toLowerCase().includes(search.toLowerCase())
            : true;
          return card.category === category.name && isSearched;
        })
        .sort(
          (a, b) =>
            CARD_SORT_FCTS[sortBy].sortFct(a, b) || a.name.localeCompare(b.name)
        ),
    }));
  }, [cardsWithDiff, premierCategories, search, sortBy]);

  const regularCategories: DeckCategoryDetails[] = useMemo(() => {
    switch (groupBy) {
      case CardGroupBy.CATEGORY:
        return visibleCategories
          .filter((category) => !category.isPremier)
          .sort((a, b) => a.name.localeCompare(b.name));
      case CardGroupBy.TYPE:
        return [
          ...new Set(
            cardsWithDiff?.map((card) => card.types.split(",")).flat()
          ),
        ]
          .map((type, index) => ({
            id: index,
            name: type,
            isPremier: false,
            includedInDeck: true,
            includedInPrice: true,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [cardsWithDiff, visibleCategories, groupBy]);

  const populatedRegularCategories: CategoryCardList[] = useMemo(() => {
    return regularCategories.map((category) => {
      return {
        category,
        cards: cardsWithDiff
          .filter((card) => {
            const isSearched = search
              ? card.name.toLowerCase().includes(search.toLowerCase())
              : true;

            switch (groupBy) {
              case CardGroupBy.CATEGORY:
                return card.category === category.name && isSearched;
              case CardGroupBy.TYPE:
                return (
                  card.types.split(",")[0] === category.name &&
                  isSearched &&
                  !premierCategories.some(
                    (category) => category.name === card.category
                  )
                );
              default:
                return false;
            }
          })
          .sort(
            (a, b) =>
              CARD_SORT_FCTS[sortBy].sortFct(a, b) ||
              a.name.localeCompare(b.name)
          ),
      };
    });
  }, [
    regularCategories,
    premierCategories,
    cardsWithDiff,
    groupBy,
    search,
    sortBy,
  ]);

  const categoryCardLists: CategoryCardList[] = useMemo(() => {
    return [
      ...populatedPremierCategories,
      ...populatedRegularCategories,
    ].filter((category) => category.cards.length > 0);
  }, [populatedPremierCategories, populatedRegularCategories]);

  const adjustedColumnCount = useMemo(() => {
    return columnCount - (versionId !== "latest" ? 1 : 0);
  }, [columnCount, versionId]);

  const columnWidth = useMemo(() => {
    return 100 / adjustedColumnCount;
  }, [adjustedColumnCount]);

  const categoryColumns: CategoryCardList[][] = useMemo(() => {
    return categoryCardLists.reduce((acc, category, index) => {
      const colIndex = index % adjustedColumnCount;
      if (acc[colIndex]) {
        acc[colIndex].push(category);
      } else {
        acc[colIndex] = [category];
      }
      return acc;
    }, [] as CategoryCardList[][]);
  }, [categoryCardLists, adjustedColumnCount]);

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

  useEffect(() => {
    const versionId = searchParams.get("version");
    const version = versions.find((version) => version.id === versionId);
    if (versionId && version) {
      setVersionId(versionId);
    }
  }, [searchParams, versions]);

  function handleVersionChange(value: string) {
    setVersionId(value);
    searchParams.set("version", value);
    setSearchParams(searchParams);
  }

  return (
    <div>
      {versions.length > 0 && (
        <Tabs.Root
          value={versionId}
          mb="3"
          onValueChange={(value) => {
            setVersionId(value);
          }}
        >
          <Tabs.List>
            {versions.map((version, index) => (
              <Tabs.Trigger
                key={version.id}
                value={version.id}
                onClick={() => handleVersionChange(version.id)}
              >
                <Flex direction="column">
                  <Text>Version {index + 1}</Text>
                  <Text size="1" color="gray" mb="2">
                    {getLongDateString(version.createdAt, false)}
                  </Text>
                </Flex>
              </Tabs.Trigger>
            ))}
            <Tabs.Trigger
              key="latest"
              value="latest"
              onClick={() => handleVersionChange("latest")}
            >
              <Flex direction="column">
                <Text>Version {versions.length + 1}</Text>
                <Text size="1" color="gray" mb="2">
                  Latest
                </Text>
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      )}

      <Flex gap="5">
        {categoryColumns.map((column, index) => (
          <Flex
            key={index}
            direction="column"
            gap="5"
            flexBasis={`${columnWidth}%`}
          >
            {column.map((category) => (
              <CardListCategory
                key={category.category.name}
                category={category}
                mousePosition={mousePosition}
                gameChangers={gameChangers}
              />
            ))}
          </Flex>
        ))}
        {versionId !== "latest" && (
          <Flex direction="column" gap="3" flexBasis={`${columnWidth}%`}>
            {cardDiffFromLatest.added.length > 0 && (
              <CardListCategory
                category={{
                  category: {
                    name: "Added",
                    isPremier: false,
                    includedInDeck: true,
                    includedInPrice: true,
                  },
                  cards: addedCardsWithQuantities,
                  description:
                    "Cards that have been added in the latest version",
                  diffType: DiffType.ADDED,
                }}
                mousePosition={mousePosition}
                gameChangers={gameChangers}
              />
            )}
            {cardDiffFromLatest.removed.length > 0 && (
              <CardListCategory
                category={{
                  category: {
                    name: "Removed",
                    isPremier: false,
                    includedInDeck: true,
                    includedInPrice: true,
                  },
                  cards: removedCardsWithQuantities,
                  description:
                    "Cards that have been removed in the latest version",
                  diffType: DiffType.REMOVED,
                }}
                mousePosition={mousePosition}
                gameChangers={gameChangers}
              />
            )}
          </Flex>
        )}
      </Flex>
    </div>
  );
}
