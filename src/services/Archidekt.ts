import {} from "../state/ArchidektReduxData";
import { CacheKey } from "../state/CacheKey";
import { DbDeck } from "../state/Deck";
import { DeckCardDetails, DeckDetails } from "../state/DeckDetails";
import { getCacheKey, getItemFromCache, setCacheKey } from "../utils/Cache";
import { getDeckCommandersString } from "../utils/Deck";
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
      return Promise.reject(new Error("Deck has no external ID"));
    }

    try {
      const deckDetails = await ArchidektService.getDeckDetailsById(
        deck.externalId,
        true
      );

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
      };

      await DeckService.update(deck.id, update);
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

  static getScryfallCardUrl(card: DeckCardDetails): string {
    const name = card.name.replace(" ", "-").toLowerCase();
    return `https://scryfall.com/card/${card.setCode}/${card.collectorNumber}/${name}`;
  }
}
