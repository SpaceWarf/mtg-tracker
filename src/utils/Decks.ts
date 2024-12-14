import { DbDeck } from "../state/Deck";

export function getDeckFullName(deck: DbDeck): string {
  return `${deck.name} [${deck.commander}]`;
}
