import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck, Deck } from "../state/Deck";
import { createItem, deleteItem, updateItem } from "../utils/Firestore";

export class DeckService {
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
