import { Flex } from "@radix-ui/themes";
import { ReactElement } from "react";
import "../../assets/styles/DeckCardPreviewSection.scss";
import { DeckCardDetails } from "../../state/DeckDetails";
import { CardPreview } from "../Cards/CardPreview";
import { DataCard } from "../Common/DataCard";

type OwnProps = {
  title: string;
  icon: ReactElement;
  cards: DeckCardDetails[];
};

export function DeckCardPreviewSection({ title, icon, cards }: OwnProps) {
  return (
    <DataCard className="deck-card-preview-section" title={title} icon={icon}>
      <Flex className="overflow-container" gap="3">
        {cards.map((card) => (
          <CardPreview key={card.name} card={card} size="small" clickable />
        ))}
      </Flex>
    </DataCard>
  );
}
