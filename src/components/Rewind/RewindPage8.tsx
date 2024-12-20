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
export function RewindPage8({ viewer, players, games, decks }: OwnProps) {
  return <div className="Background8 w-full h-full"></div>;
}
