import { DatabaseTable } from "../state/DatabaseTable";
import { DbPlayer, Player } from "../state/Player";
import { createItem, deleteItem, updateItem } from "../utils/Firestore";

export class PlayerService {
  static async create(player: Player) {
    return await createItem<Player, DbPlayer>(DatabaseTable.PLAYERS, player);
  }

  static async update(id: string, update: DbPlayer) {
    return await updateItem<DbPlayer>(DatabaseTable.PLAYERS, id, update);
  }

  static async delete(id: string) {
    return await deleteItem(DatabaseTable.PLAYERS, id);
  }
}
