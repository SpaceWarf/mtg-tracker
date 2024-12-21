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

// most played deck
export function RewindPage5({ viewer, players, games, decks }: OwnProps) {
  return <div className="Page5 w-full h-full"></div>;
}
