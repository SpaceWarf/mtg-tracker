import {} from "../state/ArchidektReduxData";
import { CacheKey } from "../state/CacheKey";
import { DeckDetails } from "../state/DeckDetails";
import { getCacheKey, getItemFromCache, setCacheKey } from "../utils/Cache";
import { ArchidektDeckScraper } from "./ArchidektDeckScraper";

export class ArchidektService {
  static async getDeckDetailsById(
    id: string,
    ignoreCache: boolean = false
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

  static getDeckUrl(id: string): string {
    return `https://archidekt.com/decks/${id}`;
  }

  static getPlayerProfileUrl(id: string): string {
    return `https://archidekt.com/search/decks?orderBy=-updatedAt&ownerUsername=${id}&page=1`;
  }
}
