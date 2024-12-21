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

// deck played ranking
export function RewindPage6({ viewer, players, games, decks }: OwnProps) {
  return <div className="Page6 w-full h-full"></div>;
}
