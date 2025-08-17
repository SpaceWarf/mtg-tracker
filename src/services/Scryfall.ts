import axios from "axios";
import { CacheKey } from "../state/CacheKey";
import { DeckCardDetails } from "../state/DeckDetails";
import { getCacheKey, getItemFromCache, setCacheKey } from "../utils/Cache";

export interface ScryfallCardObject {
  id: string;
  image_uris?: ScryfallImageUris;
  card_faces?: ScryfallCardFace[];
  scryfall_uri: string;
}

export interface ScryfallCardFace {
  name: string;
  image_uris: ScryfallImageUris;
}

export interface ScryfallImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

export class ScryfallService {
  static async getCardObject(
    card: DeckCardDetails
  ): Promise<ScryfallCardObject> {
    const cache = getCacheKey(CacheKey.CARD_DETAILS);
    const cachedCardObject = getItemFromCache<ScryfallCardObject>(
      cache,
      `${card.setCode}-${card.collectorNumber}`
    );

    if (cachedCardObject) {
      return Promise.resolve(cachedCardObject);
    }

    try {
      const res = await axios.get(
        `https://api.scryfall.com/cards/${card.setCode}/${card.collectorNumber}`
      );

      cache.set(`${card.setCode}-${card.collectorNumber}`, {
        value: res.data,
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });
      setCacheKey(CacheKey.CARD_DETAILS, cache);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
