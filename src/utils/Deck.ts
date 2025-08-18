import { Bracket } from "../state/Bracket";
import { CardDiff } from "../state/CardDiff";
import { DbDeck, DeckWithStats } from "../state/Deck";
import { DeckCardDetails } from "../state/DeckDetails";
import { DbGame } from "../state/Game";
import { IDENTITY_LABEL_MAP, IdentityLabel } from "../state/IdentityLabel";
import { getAllGamesForDeck } from "./Game";

export function getDeckGamesCount(deck: DbDeck, games: DbGame[]): number {
  return getAllGamesForDeck(deck, games).length;
}

export function getDeckWinCount(deck: DbDeck, games: DbGame[]): number {
  return getAllGamesForDeck(deck, games).filter((game) => game.won).length;
}

export function getDeckWinRate(deck: DbDeck, games: DbGame[]): number {
  const gamesCount = getDeckGamesCount(deck, games);
  const winCount = getDeckWinCount(deck, games);
  return winCount / gamesCount || 0;
}

export function getDeckCommandersString(commanders: string[]): string {
  return commanders.join(" // ");
}

export function getDeckGameChanger(
  deck: DbDeck,
  gameChangers: DeckCardDetails[]
): string[] {
  const visibleCategories = deck.categories?.filter((c) => c.includedInDeck);
  const visibleCards =
    deck.cards?.filter((c) =>
      visibleCategories?.some((cat) => cat.name === c.category)
    ) ?? [];
  return gameChangers
    .filter((gc) => visibleCards.some((c) => c.name === gc.name))
    .map((gc) => gc.name);
}

export function getDeckBracket(deck: DeckWithStats): Bracket {
  if (deck.gameChangers.length === 0) {
    return Bracket.MID_POWER;
  }

  if (deck.gameChangers.length <= 3) {
    return Bracket.HIGH_POWER;
  }

  return Bracket.ILLEGAL;
}

export function getDeckIdentityLabel(deck: DbDeck): IdentityLabel {
  if (!deck.colourIdentity?.length) {
    return IdentityLabel.COLORLESS;
  }

  return Object.keys(IDENTITY_LABEL_MAP).find((identity) => {
    const identityColours = IDENTITY_LABEL_MAP[identity as IdentityLabel];
    return (
      identityColours.sort().join(",") === deck.colourIdentity?.sort().join(",")
    );
  }) as IdentityLabel;
}

export function getDeckDescriptorString(deck: DeckWithStats): string {
  const bracket = getDeckBracket(deck);
  const identityLabel = getDeckIdentityLabel(deck);
  return `${bracket} ${identityLabel.split(" ")[0]} ${deck.format} Deck`;
}

export function getCardDiff(
  oldCards: DeckCardDetails[],
  newCards: DeckCardDetails[]
): CardDiff {
  const added = newCards.filter(
    (c) => !oldCards.some((o) => o.name === c.name)
  );
  const removed = oldCards.filter(
    (c) => !newCards.some((n) => n.name === c.name)
  );
  return { added, removed };
}
