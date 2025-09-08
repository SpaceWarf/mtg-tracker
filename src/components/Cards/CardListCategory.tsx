import { StarFilledIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import "../../assets/styles/CardListCategory.scss";
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
  groupBy?: CardGroupBy;
};

export function CardListCategory({
  category,
  mousePosition,
  gameChangers,
  groupBy,
}: OwnProps) {
  return (
    <div key={category.category.name} className="card-list-category">
      <Flex align="end" justify="between" mb="1">
        <Flex direction="column" gap="1">
          <Flex gap="1" align="center">
            {category.category.isPremier && (
              <StarFilledIcon width="16" height="16" />
            )}
            <p className="category-name">
              {groupBy === CardGroupBy.COLOUR ? (
                <IdentityHeader label={category.category.name} />
              ) : (
                category.category.name
              )}
            </p>
          </Flex>
          {category.description && (
            <p className="category-description">{category.description}</p>
          )}
        </Flex>
        <p className="category-qty">
          Qty: {category.cards.reduce((acc, card) => acc + card.qty, 0)}
        </p>
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
