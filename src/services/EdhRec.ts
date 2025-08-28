import axios from "axios";
import { Combo } from "../state/Combo";
import { DeckDetails } from "../state/DeckDetails";
import { EdhRecCombo } from "../state/EdhRecCombos";

export class EdhRecService {
  static async getDeck2CardCombos(deck: DeckDetails): Promise<Combo[]> {
    if (!deck.commanders || deck.commanders.length === 0) {
      return Promise.resolve([]);
    }

    const commander = deck.commanders[0]
      .split(" // ")[0]
      .replace(/ /g, "-")
      .replace(/(,|'|")/g, "")
      .toLowerCase();

    try {
      const res = await axios.get<EdhRecCombo>(
        `https://json.edhrec.com/pages/combos/${commander}.json`
      );
      const cardList = res.data.container.json_dict.cardlists;
      const combos: Combo[] = cardList
        .filter((card) => card.cardviews.length === 2)
        .map((card) => {
          return {
            name: card.header,
            href: card.href,
            cards: card.cardviews.map((view) => view.name),
          };
        });

      return combos;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
