import axios from "axios";
import { CacheKey } from "../state/CacheKey";
import { CardUris } from "../state/CardUris";
import { DeckCardDetails } from "../state/DeckDetails";
import { ScryfallCardObject } from "../state/ScryfallCardObject";
import { getCacheKey, getItemFromCache, setCacheKey } from "../utils/Cache";

export class ScryfallService {
  static async getCardObjectByCode(card: DeckCardDetails): Promise<CardUris> {
    const cache = getCacheKey(CacheKey.CARD_DETAILS);
    const cachedCardUris = getItemFromCache<CardUris>(
      cache,
      `${card.setCode}-${card.collectorNumber}`
    );

    if (cachedCardUris) {
      return Promise.resolve(cachedCardUris);
    }

    try {
      const { data } = await axios.get<ScryfallCardObject>(
        `https://api.scryfall.com/cards/${card.setCode}/${card.collectorNumber}`
      );
      const cardUris: CardUris = {
        uri: data.scryfall_uri,
        faceUris: data.image_uris?.border_crop
          ? [data.image_uris.border_crop]
          : data.card_faces?.map((face) => face.image_uris.border_crop) ?? [],
      };

      cache.set(`${card.setCode}-${card.collectorNumber}`, {
        value: cardUris,
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });
      setCacheKey(CacheKey.CARD_DETAILS, cache);
      return cardUris;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async getCardObjectByName(name: string): Promise<CardUris> {
    try {
      const { data } = await axios.get<ScryfallCardObject>(
        `https://api.scryfall.com/cards/named?exact=${name}`
      );
      const cardUris: CardUris = {
        uri: data.scryfall_uri,
        faceUris: data.image_uris?.border_crop
          ? [data.image_uris.border_crop]
          : data.card_faces?.map((face) => face.image_uris.border_crop) ?? [],
      };

      return cardUris;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
