import { uuidv7 } from "uuidv7";
import {} from "../state/ArchidektReduxData";
import { DbDeck } from "../state/Deck";
import { DeckDetails } from "../state/DeckDetails";
import { DeckVersion } from "../state/DeckVersion";
import { getCardDiff, getDeckCommandersString } from "../utils/Deck";
import { ArchidektDeckScraper } from "./ArchidektDeckScraper";
import { DeckService } from "./Deck";
import { EdhRecService } from "./EdhRec";

export class ArchidektService {
  static async getDeckDetailsById(id: string): Promise<DeckDetails> {
    try {
      const scraper = new ArchidektDeckScraper(id);
      await scraper.scrape();
      const deckDetails = scraper.getDeckDetails(id);
      console.log(deckDetails);
      const possibleCombos = await EdhRecService.getDeck2CardCombos(
        deckDetails
      );
      console.log(possibleCombos);

      return Promise.resolve({
        ...deckDetails,
        possibleCombos,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async syncDeckDetails(deck: DbDeck): Promise<DbDeck> {
    if (!deck.externalId) {
      console.log("Sync Skipped: Deck has no external ID", deck.name);
      return Promise.resolve(deck);
    }

    try {
      const deckDetails: DeckDetails =
        await ArchidektService.getDeckDetailsById(deck.externalId);
      const newVersion = ArchidektService.createDeckVersion(deck, deckDetails);

      const update: DbDeck = {
        ...deck,
        name: deckDetails.title,
        commander: getDeckCommandersString(deckDetails.commanders),
        featured: deckDetails.featured,
        price: deckDetails.price,
        saltSum: deckDetails.saltSum,
        size: deckDetails.size,
        viewCount: deckDetails.viewCount,
        format: deckDetails.format,
        deckCreatedAt: deckDetails.createdAt,
        deckUpdatedAt: deckDetails.updatedAt,
        colourIdentity: deckDetails.colourIdentity,
        cards: deckDetails.cards,
        categories: deckDetails.categories,
        versions: newVersion
          ? [...(deck.versions ?? []), newVersion]
          : deck.versions,
        latestVersionId: newVersion?.id ?? deck.latestVersionId,
        possibleCombos: deckDetails.possibleCombos,
      };

      await DeckService.update(deck.id, update);
      return Promise.resolve(update);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static createDeckVersion(
    deck: DbDeck,
    syncedDetails: DeckDetails
  ): DeckVersion | null {
    const cardDiff = getCardDiff(deck, syncedDetails);

    if (cardDiff.added.length === 0 && cardDiff.removed.length === 0) {
      return null;
    }

    return {
      id: uuidv7(),
      createdAt: new Date().toISOString(),
      cardDiff,
    };
  }

  static getDeckUrl(id: string): string {
    return `https://archidekt.com/decks/${id}`;
  }

  static getPlayerProfileUrl(id: string): string {
    return `https://archidekt.com/search/decks?orderBy=-updatedAt&ownerUsername=${id}&page=1`;
  }
}
