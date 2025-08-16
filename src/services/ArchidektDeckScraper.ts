import { ArchidektClasses } from "../state/ArchidektClasses";
import {
  ArchidektReduxCard,
  ArchidektReduxCategory,
  ArchidektReduxData,
  ArchidektReduxDeck,
} from "../state/ArchidektRedux";
import { DeckDetails } from "../state/DeckDetails";
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
    console.log(this.deckData);
  }

  getDeckDetails(id: string): DeckDetails {
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
    };
  }

  getCommandersString(commanders: string[]): string {
    return commanders.join(" // ");
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
}
