import { DatabaseTable } from "../state/DatabaseTable";
import { DbGame, Game } from "../state/Game";
import { createItem, deleteItem, updateItem } from "../utils/Firestore";

export class GameService {
  static async create(game: Game) {
    return await createItem<Game, DbGame>(DatabaseTable.GAMES, game);
  }

  static async update(id: string, update: DbGame) {
    return await updateItem<DbGame>(DatabaseTable.GAMES, id, update);
  }

  static async delete(id: string) {
    return await deleteItem(DatabaseTable.GAMES, id);
  }
}
