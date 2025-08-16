import {} from "../state/ArchidektRedux";
import { CacheKey } from "../state/CacheKey";
import { DeckDetails } from "../state/DeckDetails";
import { getCacheKey, getItemFromCache, setCacheKey } from "../utils/Cache";
import { ArchidektScrapper } from "./ArchidektScrapper";

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

    const scrapper = new ArchidektScrapper(`https://archidekt.com/decks/${id}`);
    await scrapper.scrape();
    const deckDetails = scrapper.getDeckDetails(id);

    cache.set(deckDetails.id, {
      value: deckDetails,
      expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });
    setCacheKey(CacheKey.DECKS_DETAILS, cache);
    return Promise.resolve(deckDetails);
  }
}
