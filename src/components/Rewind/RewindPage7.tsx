import "@assets/styles/Rewind.scss";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";

type OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

// End card
export function RewindPage7({ viewer, players, games, decks }: OwnProps) {
  return <div className="Page7 w-full h-full"></div>;
}
