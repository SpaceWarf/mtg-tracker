import { ArchidektClasses } from "../state/ArchidektClasses";
import {
  ArchidektReduxCard,
  ArchidektReduxCardLayout,
  ArchidektReduxCategory,
  ArchidektReduxData,
  ArchidektReduxDeck,
} from "../state/ArchidektReduxData";
import {
  DeckCardDetails,
  DeckCategoryDetails,
  DeckDetails,
} from "../state/DeckDetails";
import { HTMLScraper } from "./HTMLScraper";

export class ArchidektDeckScraper extends HTMLScraper {
  private deckData: ArchidektReduxDeck | undefined;

  constructor(id: string) {
    super(`https://archidekt.com/decks/${id}`);
  }

  async scrape(): Promise<void> {
    await super.scrape();
    const reduxData = this.getReduxData();
    this.deckData = reduxData?.deck;
  }

  getDeckDetails(id: string): DeckDetails {
    const categories = this.getCategories();
    return {
      id: id,
      url: this.getUrl(),
      title: this.getTitle(),
      price: this.getPrice(),
      saltSum: this.getSaltSum(),
      size: this.getSize(),
      viewCount: this.getViewCount(),
      format: this.getFormat(),
      featured: this.getFeatured(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      commanders: this.getCommanders(),
      owner: this.getOwner(),
      ownerId: this.getOwnerId(),
      colourIdentity: this.getColourIdentity(),
      cards: this.getCards(categories),
      categories: categories,
    };
  }

  private getReduxData(): ArchidektReduxData | undefined {
    const nextData = this.querySelector("script#__NEXT_DATA__")?.childNodes[0]
      ?.textContent;

    if (nextData) {
      const nextDataJson = JSON.parse(nextData);
      return nextDataJson.props.pageProps.redux;
    }
  }

  private getTitle(): string {
    return this.getElementTextByClass(ArchidektClasses.TITLE);
  }

  private getPrice(): string {
    return this.getElementTextByClass(ArchidektClasses.PRICE);
  }

  private getSaltSum(): string {
    return this.getElementTextByClass(ArchidektClasses.SALT_SUM);
  }

  private getSize(): string {
    const sizeEl = this.querySelector("[class^='deckHeader_row_'] > div");
    const sizeTextContent = sizeEl?.textContent ?? "";
    return sizeTextContent.split(" ")[2];
  }

  private getViewCount(): string {
    if (this.deckData) {
      return `${this.deckData.viewCount}`;
    }
    return this.getElementTextByClass(ArchidektClasses.VIEW_COUNT);
  }

  private getFormat(): string {
    return this.getElementTextByClass(ArchidektClasses.FORMAT);
  }

  private getFeatured(): string {
    return this.deckData?.featured ?? "";
  }

  private getCreatedAt(): string {
    return this.deckData?.createdAt ?? "";
  }

  private getUpdatedAt(): string {
    return this.deckData?.updatedAt ?? "";
  }

  private getCommanders(): string[] {
    return this.getPremierCards().map((card) => card.name);
  }

  private getColourIdentity(): string[] {
    return this.getPremierCards().reduce((acc, card) => {
      return [...new Set([...acc, ...card.colorIdentity])];
    }, [] as string[]);
  }

  private getPremierCategories(): ArchidektReduxCategory[] {
    const categories = this.deckData?.categories ?? {};
    return Object.values(categories).filter((category) => category.isPremier);
  }

  private getPremierCards(): ArchidektReduxCard[] {
    const cards = this.deckData?.cardMap ?? {};
    const premierCategories = this.getPremierCategories();
    return Object.values(cards).filter((card) =>
      premierCategories.some((category) =>
        card.categories.includes(category.name)
      )
    );
  }

  private getOwner(): string {
    return this.deckData?.owner ?? "";
  }

  private getOwnerId(): string {
    return `${this.deckData?.ownerId ?? ""}`;
  }

  private getCards(categories: DeckCategoryDetails[]): DeckCardDetails[] {
    const visibleCategories = categories
      .filter((cat) => cat.includedInDeck && cat.name !== "Sideboard")
      .map((cat) => cat.name);
    return Object.values(this.deckData?.cardMap ?? {})
      .map((card) => ({
        name: card.name,
        category: card.categories[0],
        colourIdentity: card.colorIdentity.join(","),
        cmc: card.cmc,
        castingCost: this.getCardCastingCost(card),
        types: card.types.join(","),
        text: card.text,
        gameChanger: card.gameChanger,
        qty: card.qty,
        collectorNumber: card.collectorNumber,
        setCode: card.setCode,
        layout: card.layout,
        massLandDenial: card.massLandDenial,
        manaProduction: card.manaProduction,
        extraTurns: card.extraTurns,
        tutor: card.tutor,
      }))
      .filter((card) => visibleCategories.includes(card.category));
  }

  private getCardCastingCost(card: ArchidektReduxCard): string {
    switch (card.layout) {
      case ArchidektReduxCardLayout.MODAL_DFC:
      case ArchidektReduxCardLayout.FLIP:
      case ArchidektReduxCardLayout.TRANSFORM:
      case ArchidektReduxCardLayout.REVERSIBLE_CARD:
      case ArchidektReduxCardLayout.ADVENTURE:
        return this.getMultiCostLayoutCardCastingCost(card);
      case ArchidektReduxCardLayout.SPLIT:
      case ArchidektReduxCardLayout.NORMAL:
      default:
        return this.getNormalLayoutCardCastingCost(card);
    }
  }

  private getMultiCostLayoutCardCastingCost(card: ArchidektReduxCard): string {
    const frontCost = this.getFlatCastingCost(card.front.castingCost);
    const backCost = this.getFlatCastingCost(card.back.castingCost);
    return `${frontCost},//,${backCost}`;
  }

  private getNormalLayoutCardCastingCost(card: ArchidektReduxCard): string {
    return this.getFlatCastingCost(card.castingCost);
  }

  private getFlatCastingCost(castingCost: (string | string[])[]): string {
    const cost: string[] = [];
    castingCost.forEach((costFragment) => {
      if (costFragment instanceof Array) {
        cost.push(costFragment.join(""));
      } else {
        cost.push(costFragment);
      }
    });
    return cost.join(",");
  }

  private getCategories(): DeckCategoryDetails[] {
    return Object.values(this.deckData?.categories ?? {}).map((category) => ({
      id: category.id,
      name: category.name,
      isPremier: category.isPremier,
      includedInDeck: category.includedInDeck,
      includedInPrice: category.includedInPrice,
    }));
  }
}
