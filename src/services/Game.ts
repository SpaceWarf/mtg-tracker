import { DatabaseTable } from "../state/DatabaseTable";
import { DbGame } from "../state/Game";
import { updateItem } from "../utils/Firestore";

export class GameService {
  static async update(id: string, update: DbGame) {
    return await updateItem(DatabaseTable.GAMES, id, update);
  }
}
