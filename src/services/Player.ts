import { CacheKey } from "../state/CacheKey";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbPlayer, Player } from "../state/Player";
import { getCacheKey, setCacheKey } from "../utils/Cache";
import {
  createItem,
  deleteItem,
  getItemById,
  updateItem,
} from "../utils/Firestore";

export class PlayerService {
  static async getById(id: string): Promise<DbPlayer> {
    const cache = getCacheKey(CacheKey.PLAYERS);
    const cachedPlayer = cache.get(id);

    if (cachedPlayer) {
      return Promise.resolve(cachedPlayer);
    }

    const player = await getItemById<DbPlayer>(DatabaseTable.PLAYERS, id);
    cache.set(player.id, player);
    setCacheKey(CacheKey.PLAYERS, cache);
    return Promise.resolve(player);
  }

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
