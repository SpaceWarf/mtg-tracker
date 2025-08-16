import { ArchidektClasses } from "../state/ArchidektClasses";
import {
  ArchidektReduxCard,
  ArchidektReduxCategory,
  ArchidektReduxData,
  ArchidektReduxDeck,
} from "../state/ArchidektRedux";
import { DeckDetails } from "../state/DeckDetails";
import { HTMLScrapper } from "./HTMLScrapper";

export class ArchidektScrapper extends HTMLScrapper {
  private deckData: ArchidektReduxDeck | undefined;

  constructor(url: string) {
    super(url);
  }

  async scrape(): Promise<void> {
    await super.scrape();
    const reduxData = this.getReduxData();
    this.deckData = reduxData?.deck;
  }

  getDeckDetails(id: string): DeckDetails {
    return {
      id: id,
      url: this.getUrl(),
      title: this.getDeckTitle(),
      price: this.getDeckPrice(),
      saltSum: this.getDeckSaltSum(),
      size: this.getDeckSize(),
      viewCount: this.getDeckViewCount(),
      format: this.getDeckFormat(),
      featured: this.getDeckFeatured(),
      createdAt: this.getDeckCreatedAt(),
      updatedAt: this.getDeckUpdatedAt(),
      commanders: this.getDeckCommanders(),
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

  private getDeckTitle(): string {
    return this.getElementTextByClass(ArchidektClasses.TITLE);
  }

  private getDeckPrice(): string {
    return this.getElementTextByClass(ArchidektClasses.PRICE);
  }

  private getDeckSaltSum(): string {
    return this.getElementTextByClass(ArchidektClasses.SALT_SUM);
  }

  private getDeckSize(): string {
    const sizeEl = this.querySelector("[class^='deckHeader_row_'] > div");
    const sizeTextContent = sizeEl?.textContent ?? "";
    return sizeTextContent.split(" ")[2];
  }

  private getDeckViewCount(): string {
    if (this.deckData) {
      return `${this.deckData.viewCount}`;
    }
    return this.getElementTextByClass(ArchidektClasses.VIEW_COUNT);
  }

  private getDeckFormat(): string {
    return this.getElementTextByClass(ArchidektClasses.FORMAT);
  }

  private getDeckFeatured(): string {
    return this.deckData?.featured ?? "";
  }

  private getDeckCreatedAt(): string {
    return this.deckData?.createdAt ?? "";
  }

  private getDeckUpdatedAt(): string {
    return this.deckData?.updatedAt ?? "";
  }

  private getDeckCommanders(): string[] {
    return this.getDeckPremierCards().map((card) => card.name);
  }

  private getDeckPremierCategories(): ArchidektReduxCategory[] {
    const categories = this.deckData?.categories ?? {};
    return Object.values(categories).filter((category) => category.isPremier);
  }

  private getDeckPremierCards(): ArchidektReduxCard[] {
    const cards = this.deckData?.cardMap ?? {};
    const premierCategories = this.getDeckPremierCategories();
    return Object.values(cards).filter((card) =>
      premierCategories.some((category) =>
        card.categories.includes(category.name)
      )
    );
  }
}
