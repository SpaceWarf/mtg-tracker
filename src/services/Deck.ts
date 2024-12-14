import { CacheKey } from "../state/CacheKey";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck } from "../state/Deck";
import { getCacheKey, setCacheKey } from "../utils/Cache";
import { getItemById } from "../utils/Firestore";

export class DeckService {
  static async getById(id: string): Promise<DbDeck> {
    const cache = getCacheKey(CacheKey.DECKS);
    const cachedDeck = cache.get(id);

    if (cachedDeck) {
      return Promise.resolve(cachedDeck);
    }

    const deck = await getItemById<DbDeck>(DatabaseTable.DECKS, id);
    cache.set(deck.id, deck);
    setCacheKey(CacheKey.DECKS, cache);
    return Promise.resolve(deck);
  }
}
