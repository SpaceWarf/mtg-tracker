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

// Games started
export function RewindPage4({ viewer, players, games, decks }: OwnProps) {
  return <div className="Background4 w-full h-full"></div>;
}
