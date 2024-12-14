import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck, Deck } from "../state/Deck";
import { parseAsJson } from "../utils/CSV";
import { createItem } from "../utils/Firestore";

export async function run() {
  parseAsJson("decks.csv", (rows) => {
    rows.forEach((row) => {
      createItem<Deck, DbDeck>(DatabaseTable.DECKS, {
        name: row.Name,
        commander: row.Commander,
      });
    });
  });
}
