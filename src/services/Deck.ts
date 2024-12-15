import { CacheKey } from "../state/CacheKey";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck, Deck } from "../state/Deck";
import { getCacheKey, setCacheKey } from "../utils/Cache";
import {
  createItem,
  deleteItem,
  getItemById,
  updateItem,
} from "../utils/Firestore";

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

  static async create(deck: Deck) {
    return await createItem<Deck, DbDeck>(DatabaseTable.DECKS, deck);
  }

  static async update(id: string, update: DbDeck) {
    return await updateItem<DbDeck>(DatabaseTable.DECKS, id, update);
  }

  static async delete(id: string) {
    return await deleteItem(DatabaseTable.DECKS, id);
  }
}
