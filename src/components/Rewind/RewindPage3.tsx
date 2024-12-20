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

// Comparative win rate
export function RewindPage3({ viewer, players, games, decks }: OwnProps) {
  return <div className="Page3 w-full h-full"></div>;
}
