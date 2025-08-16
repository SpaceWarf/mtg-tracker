import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck } from "../state/Deck";
import { getItems, updateItem } from "../utils/Firestore";

export async function run() {
  const decks = await getItems<DbDeck>(DatabaseTable.DECKS);
  decks.forEach(async (deck) => {
    updateItem<DbDeck>(DatabaseTable.DECKS, deck.id, {
      ...deck,
      externalId: deck.url?.split("/")[4],
    });
  });
}
