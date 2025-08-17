import axios from "axios";
import { DeckCardDetails } from "../state/DeckDetails";

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
    try {
      const res = await axios.get(
        `https://api.scryfall.com/cards/${card.setCode}/${card.collectorNumber}`
      );
      console.log(card.name, res.data);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
