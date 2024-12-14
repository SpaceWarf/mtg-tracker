import { CacheKey } from "../state/CacheKey";
import { DatabaseTable } from "../state/DatabaseTable";
import { DbPlayer } from "../state/Player";
import { getCacheKey, setCacheKey } from "../utils/Cache";
import { getItemById } from "../utils/Firestore";

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
}
