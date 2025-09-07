import { Flex } from "@radix-ui/themes";
import { ReactElement } from "react";
import "../../assets/styles/DeckCardPreviewSection.scss";
import { DeckCardDetails } from "../../state/DeckDetails";
import { CardPreview } from "../Cards/CardPreview";

type OwnProps = {
  title: string;
  icon: ReactElement;
  cards: DeckCardDetails[];
};

export function DeckCardPreviewSection({ title, icon, cards }: OwnProps) {
  return (
    <Flex className="data-card deck-card-preview-section" direction="column">
      <Flex className="title" align="center" gap="3" mb="5">
        {icon}
        <p>
          {title} ({cards.length})
        </p>
      </Flex>
      <Flex className="overflow-container" gap="3">
        {cards.map((card) => (
          <CardPreview key={card.name} card={card} size="small" clickable />
        ))}
      </Flex>
    </Flex>
  );
}
