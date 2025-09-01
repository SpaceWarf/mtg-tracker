import axios from "axios";
import { Combo } from "../state/Combo";
import { DeckDetails } from "../state/DeckDetails";
import { EdhRecCombo } from "../state/EdhRecCombos";
import { getSanitizedCommanderString } from "../utils/Deck";

export class EdhRecService {
  static async getDeckInfiniteCombos(deck: DeckDetails): Promise<Combo[]> {
    if (!deck.commanders || deck.commanders.length === 0) {
      return Promise.resolve([]);
    }

    try {
      const res = await axios.get<EdhRecCombo>(
        `https://json.edhrec.com/pages/combos/${getSanitizedCommanderString(
          deck.commanders.join(" & ")
        )}.json`
      );
      const cardList = res.data.container.json_dict.cardlists;
      const combos: Combo[] = cardList.map((card) => {
        return {
          name: card.header,
          href: card.href,
          cards: card.cardviews.map((view) => view.name),
          bracket: card.combo.comboVote?.bracket ?? "unavailable",
          results: card.combo.results.filter(
            (result) =>
              result !== "Win the game" && !result.startsWith("Near-infinite")
          ),
        };
      });

      return combos.filter((combo) => combo.results.length > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static getDeckUrl(id: string): string {
    console.log(id);
    return `https://edhrec.com/commanders/${getSanitizedCommanderString(id)}`;
  }
}
