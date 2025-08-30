import { Flex, Tabs, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useDecks } from "../../hooks/useDecks";
import { useMousePosition } from "../../hooks/useMousePosition";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { CARD_SORT_FCTS } from "../../state/CardSortFcts";
import { CategoryCardList } from "../../state/CategoryCardList";
import { DbDeck } from "../../state/Deck";
import { DeckCardDetails, DeckCategoryDetails } from "../../state/DeckDetails";
import { removeDuplicatesByKey } from "../../utils/Array";
import { getLongDateString } from "../../utils/Date";
import {
  getAggregatedCardDiff,
  getColourIdentityLabel,
} from "../../utils/Deck";
import { DeckVersionViewer } from "../Decks/DeckVersionViewer";
import { CardDiffViewer } from "./CardDiffViewer";
import { CardListCategory } from "./CardListCategory";

type OwnProps = {
  groupBy: CardGroupBy;
  sortBy: CardSortFctKey;
  search: string;
  showVersionGraph: boolean;
  deck: DbDeck;
  columnCount?: number;
  forcedCategoryOrder?: string[];
};

export function CardList({
  groupBy,
  sortBy,
  search,
  showVersionGraph,
  deck,
  columnCount = 5,
  forcedCategoryOrder,
}: OwnProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbDecks } = useDecks();
  const mousePosition = useMousePosition();
  const [versionId, setVersionId] = useState<string>("latest");

  const versions = useMemo(() => {
    return deck.versions ?? [];
  }, [deck]);

  const cards = useMemo(() => {
    return deck.cards ?? [];
  }, [deck]);

  const categories = useMemo(() => {
    return deck.categories ?? [];
  }, [deck]);

  const cardDiffFromLatest = useMemo(() => {
    return getAggregatedCardDiff(versions, versionId);
  }, [versionId, versions]);

  const gameChangers = useMemo(() => {
    return dbDecks?.find((deck) => deck.gameChangersDeck)?.cards;
  }, [dbDecks]);

  const addedCardsWithQuantities = useMemo(() => {
    return (
      cardDiffFromLatest?.added
        .map((diff) => ({
          ...diff.card,
          qty: diff.qty,
        }))
        .sort(
          (a, b) =>
            CARD_SORT_FCTS[sortBy].sortFct(a, b) || a.name.localeCompare(b.name)
        ) ?? []
    );
  }, [cardDiffFromLatest, sortBy]);

  const removedCardsWithQuantities = useMemo(() => {
    return (
      cardDiffFromLatest?.removed
        .map((diff) => ({
          ...diff.card,
          qty: diff.qty,
        }))
        .sort(
          (a, b) =>
            CARD_SORT_FCTS[sortBy].sortFct(a, b) || a.name.localeCompare(b.name)
        ) ?? []
    );
  }, [cardDiffFromLatest, sortBy]);

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
    function getColourCategories() {
      const colourSortOrder = [
        "Mono-White (W)",
        "Mono-Blue (U)",
        "Mono-Black (B)",
        "Mono-Red (R)",
        "Mono-Green (G)",
        "Colorless (C)",
      ];

      const categories = [
        ...new Set(
          cardsWithDiff?.map((card) =>
            getColourIdentityLabel(card.colourIdentity.split(","), card.types)
          )
        ),
      ].map((colour, index) => ({
        id: index,
        name: colour,
        isPremier: false,
        includedInDeck: true,
        includedInPrice: true,
      }));
      const monoCategories = categories
        .filter(
          (category) =>
            category.name.startsWith("Mono-") ||
            category.name === "Colorless (C)"
        )
        .sort(
          (a, b) =>
            colourSortOrder.indexOf(a.name) - colourSortOrder.indexOf(b.name)
        );
      const otherCategories = categories
        .filter(
          (category) =>
            !category.name.startsWith("Mono-") &&
            category.name !== "Colorless (C)"
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      return [...monoCategories, ...otherCategories];
    }

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
      case CardGroupBy.COLOUR:
        return getColourCategories();
      default:
        return [];
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
              case CardGroupBy.COLOUR:
                return (
                  getColourIdentityLabel(
                    card.colourIdentity.split(","),
                    card.types
                  ) === category.name &&
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
    const categories = [
      ...populatedPremierCategories,
      ...populatedRegularCategories,
    ].filter((category) => category.cards.length > 0);

    if (forcedCategoryOrder && groupBy === CardGroupBy.CATEGORY) {
      return categories.sort((a, b) => {
        const aIndex = forcedCategoryOrder.indexOf(a.category.name);
        const bIndex = forcedCategoryOrder.indexOf(b.category.name);
        return aIndex - bIndex;
      });
    }

    return categories;
  }, [
    populatedPremierCategories,
    populatedRegularCategories,
    forcedCategoryOrder,
    groupBy,
  ]);

  const adjustedColumnCount = useMemo(() => {
    return columnCount - (versionId !== "latest" ? 1 : 0);
  }, [columnCount, versionId]);

  const columnWidth = useMemo(() => {
    return 100 / columnCount;
  }, [columnCount]);

  const marginToRemove = useMemo(() => {
    return (20 * (columnCount - 1)) / columnCount;
  }, [columnCount]);

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

  function getVersionDate(id: string): string {
    if (id === "latest") {
      return getLongDateString(versions[versions.length - 1].createdAt, false);
    }

    const versionIdx = versions.findIndex((v) => v.id === id);

    if (versionIdx === 0) {
      return getLongDateString(deck.createdAt, false);
    }

    return getLongDateString(versions[versionIdx - 1].createdAt, false);
  }

  return (
    <div>
      {showVersionGraph && (
        <DeckVersionViewer
          deck={deck}
          sortCardsBy={sortBy}
          mousePosition={mousePosition}
          gameChangers={gameChangers ?? []}
          selectedVersionId={versionId}
          onClickVersion={handleVersionChange}
        />
      )}

      {versions.length > 0 && (
        <Tabs.Root
          value={versionId}
          mb="3"
          mt={showVersionGraph ? "3" : "0"}
          onValueChange={(value) => {
            setVersionId(value);
          }}
        >
          <Tabs.List style={{ overflowY: "hidden", overflowX: "scroll" }}>
            {versions.map((version, index) => (
              <Tabs.Trigger
                key={version.id}
                value={version.id}
                onClick={() => handleVersionChange(version.id)}
              >
                <Flex direction="column">
                  <Text>Version {index + 1}</Text>
                  <Text size="1" color="gray" mb="2">
                    {getVersionDate(version.id)}
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
                <Text>Version {versions.length + 1} </Text>
                <Text size="1" color="gray" mb="2">
                  {getVersionDate("latest")}
                </Text>
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      )}

      <Flex gap="20px">
        {categoryColumns.map((column, index) => (
          <Flex
            key={index}
            direction="column"
            gap="20px"
            width={`calc(${columnWidth}% - ${marginToRemove}px)`}
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
          <Flex width={`calc(${columnWidth}% - ${marginToRemove}px)`}>
            <CardDiffViewer
              added={addedCardsWithQuantities}
              removed={removedCardsWithQuantities}
              mousePosition={mousePosition}
              gameChangers={gameChangers ?? []}
              withDescription
            />
          </Flex>
        )}
      </Flex>
    </div>
  );
}
