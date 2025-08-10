import { DatabaseTable } from "../state/DatabaseTable";
import { DbPlayer, Player } from "../state/Player";
import { createItem } from "../utils/Firestore";

const PLAYERS = ["Gabriel", "Simon", "Chloé", "Peru", "Alex"];
export async function run() {
  for (let i = 0; i < PLAYERS.length; i++) {
    await createItem<Player, DbPlayer>(DatabaseTable.PLAYERS, {
      name: PLAYERS[i],
      profileUrl: "",
    });
  }
}
