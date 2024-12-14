import { DatabaseTable } from "../state/DatabaseTable";
import { DbDeck } from "../state/Deck";
import { DbGame, Game } from "../state/Game";
import { DbPlayer } from "../state/Player";
import { parseAsJson } from "../utils/CSV";
import { createItem, getItemsByName } from "../utils/Firestore";

export async function run() {
  parseAsJson("games.csv", async (rows) => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const player1 = await getItemsByName<DbPlayer>(
        DatabaseTable.PLAYERS,
        row["Name 1"]
      );
      const deck1 = await getItemsByName<DbDeck>(
        DatabaseTable.DECKS,
        row["Deck 1"]
      );
      const player2 = await getItemsByName<DbPlayer>(
        DatabaseTable.PLAYERS,
        row["Name 2"]
      );
      const deck2 = await getItemsByName<DbDeck>(
        DatabaseTable.DECKS,
        row["Deck 2"]
      );
      const player3 = await getItemsByName<DbPlayer>(
        DatabaseTable.PLAYERS,
        row["Name 3"]
      );
      const deck3 = await getItemsByName<DbDeck>(
        DatabaseTable.DECKS,
        row["Deck 3"]
      );
      const player4 = await getItemsByName<DbPlayer>(
        DatabaseTable.PLAYERS,
        row["Name 4"]
      );
      const deck4 = await getItemsByName<DbDeck>(
        DatabaseTable.DECKS,
        row["Deck 4"]
      );

      const game: Game = {
        date: row.Date,
        player1: {
          player: player1[0].id,
          deck: deck1[0].id,
          started: row["Started? 1"] === "TRUE",
          t1SolRing: row["T1 Sol Ring? 1"] === "TRUE",
          won: row["Won? 1"] === "TRUE",
        },
        player2: {
          player: player2[0].id,
          deck: deck2[0].id,
          started: row["Started? 2"] === "TRUE",
          t1SolRing: row["T1 Sol Ring? 2"] === "TRUE",
          won: row["Won? 2"] === "TRUE",
        },
        player3: {
          player: player3[0].id,
          deck: deck3[0].id,
          started: row["Started? 3"] === "TRUE",
          t1SolRing: row["T1 Sol Ring? 3"] === "TRUE",
          won: row["Won? 3"] === "TRUE",
        },
        player4: {
          player: player4[0].id,
          deck: deck4[0].id,
          started: row["Started? 4"] === "TRUE",
          t1SolRing: row["T1 Sol Ring? 4"] === "TRUE",
          won: row["Won? 4"] === "TRUE",
        },
        comments: row.Comments,
      };
      console.log(`Creating game ${i + 1} of ${rows.length}`, game);
      await createItem<Game, DbGame>(DatabaseTable.GAMES, game);
    }
  });
}
