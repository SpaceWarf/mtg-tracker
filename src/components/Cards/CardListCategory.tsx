import { StarFilledIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { CategoryCardList } from "../../state/CategoryCardList";
import { DeckCardDetails } from "../../state/DeckDetails";
import { MousePosition } from "../../state/MousePosition";
import { CardListCard } from "./CardListCard";

type OwnProps = {
  category: CategoryCardList;
  mousePosition: MousePosition;
  gameChangers?: DeckCardDetails[];
};

export function CardListCategory({
  category,
  mousePosition,
  gameChangers,
}: OwnProps) {
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
        <CardListCard
          key={card.name}
          card={card}
          mousePosition={mousePosition}
          gameChangers={gameChangers}
        />
      ))}
    </div>
  );
}
