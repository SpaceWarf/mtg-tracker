import { StarFilledIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { CardGroupBy } from "../../state/CardGroupBy";
import { CategoryCardList } from "../../state/CategoryCardList";
import { DeckCardDetails } from "../../state/DeckDetails";
import { MousePosition } from "../../state/MousePosition";
import { IdentityHeader } from "../Common/IdentityHeader";
import { CardListCard } from "./CardListCard";

type OwnProps = {
  category: CategoryCardList;
  mousePosition: MousePosition;
  gameChangers?: DeckCardDetails[];
  groupBy: CardGroupBy;
};

export function CardListCategory({
  category,
  mousePosition,
  gameChangers,
  groupBy,
}: OwnProps) {
  return (
    <div key={category.category.name}>
      <Flex align="end" justify="between">
        <Flex direction="column">
          <Flex gap="1" align="center">
            {category.category.isPremier && (
              <StarFilledIcon width="16" height="16" />
            )}
            <Heading size="3">
              {groupBy === CardGroupBy.COLOUR ? (
                <IdentityHeader label={category.category.name} />
              ) : (
                category.category.name
              )}
            </Heading>
          </Flex>
          {category.description && (
            <Text className="text-gray-400" size="2">
              {category.description}
            </Text>
          )}
        </Flex>
        <Text className="text-gray-400" size="2">
          Qty: {category.cards.reduce((acc, card) => acc + card.qty, 0)}
        </Text>
      </Flex>
      {category.cards.map((card) => (
        <CardListCard
          key={card.name}
          card={card}
          mousePosition={mousePosition}
          gameChangers={gameChangers}
          diffType={category.diffType}
        />
      ))}
    </div>
  );
}
