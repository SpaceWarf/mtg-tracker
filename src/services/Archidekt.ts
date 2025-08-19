import { uuidv7 } from "uuidv7";
import {} from "../state/ArchidektReduxData";
import { CacheKey } from "../state/CacheKey";
import { DbDeck } from "../state/Deck";
import { DeckDetails } from "../state/DeckDetails";
import { DeckVersion } from "../state/DeckVersion";
import { getCacheKey, getItemFromCache, setCacheKey } from "../utils/Cache";
import { getCardDiff, getDeckCommandersString } from "../utils/Deck";
import { ArchidektDeckScraper } from "./ArchidektDeckScraper";
import { DeckService } from "./Deck";

export class ArchidektService {
  static async getDeckDetailsById(
    id: string,
    ignoreCache: boolean = true
  ): Promise<DeckDetails> {
    const cache = getCacheKey(CacheKey.DECKS_DETAILS);
    const cachedDeckDetails = getItemFromCache<DeckDetails>(cache, id);

    if (cachedDeckDetails && !ignoreCache) {
      return Promise.resolve(cachedDeckDetails);
    }

    try {
      const scraper = new ArchidektDeckScraper(id);
      await scraper.scrape();
      const deckDetails = scraper.getDeckDetails(id);

      cache.set(deckDetails.id, {
        value: deckDetails,
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });
      setCacheKey(CacheKey.DECKS_DETAILS, cache);
      return Promise.resolve(deckDetails);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async syncDeckDetails(deck: DbDeck) {
    if (!deck.externalId) {
      console.log("Sync Skipped: Deck has no external ID", deck.name);
      return;
    }

    try {
      const deckDetails: DeckDetails =
        await ArchidektService.getDeckDetailsById(deck.externalId, true);
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
      };

      await DeckService.update(deck.id, update);
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
