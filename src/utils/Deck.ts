import { Bracket } from "../state/Bracket";
import { CardDiff, CardDiffItem } from "../state/CardDiff";
import { DbDeck, DeckWithStats } from "../state/Deck";
import { DeckCardDetails, DeckDetails } from "../state/DeckDetails";
import { DeckVersion } from "../state/DeckVersion";
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
  deck: DbDeck,
  syncedDetails: DeckDetails
): CardDiff {
  const deckVisibleCategories =
    deck.categories?.filter(
      (cat) => cat.includedInDeck && cat.name !== "Sideboard"
    ) ?? [];
  const deckVisibleCards =
    deck.cards?.filter((card) =>
      deckVisibleCategories.some((cat) => cat.name === card.category)
    ) ?? [];

  const syncedVisibleCategories =
    syncedDetails.categories?.filter(
      (cat) => cat.includedInDeck && cat.name !== "Sideboard"
    ) ?? [];
  const syncedVisibleCards =
    syncedDetails.cards?.filter((card) =>
      syncedVisibleCategories.some((cat) => cat.name === card.category)
    ) ?? [];

  const added: CardDiffItem[] = [];
  const removed: CardDiffItem[] = [];

  const versionedMap: Record<string, DeckCardDetails> = {};
  for (const card of deckVisibleCards) {
    versionedMap[card.name] = card;
  }

  const latestMap: Record<string, DeckCardDetails> = {};
  for (const card of syncedVisibleCards) {
    latestMap[card.name] = card;
  }

  for (const cardName of Object.keys(versionedMap)) {
    const versionedCard = versionedMap[cardName];
    const latestCard = latestMap[cardName];

    if (!latestCard) {
      removed.push({ card: versionedCard, qty: versionedCard.qty });
    } else if (versionedCard.qty > latestCard.qty) {
      removed.push({
        card: versionedCard,
        qty: versionedCard.qty - latestCard.qty,
      });
    }
  }

  for (const cardName of Object.keys(latestMap)) {
    const latestCard = latestMap[cardName];
    const versionedCard = versionedMap[cardName];

    if (!versionedCard) {
      added.push({ card: latestCard, qty: latestCard.qty });
    } else if (latestCard.qty > versionedCard.qty) {
      added.push({ card: latestCard, qty: latestCard.qty - versionedCard.qty });
    }
  }
  return { added, removed };
}

export function getAggregatedCardDiff(
  versions: DeckVersion[],
  versionId: string
): CardDiff {
  const versionIdx = versions.findIndex((v) => v.id === versionId);

  if (versionIdx === -1) {
    return { added: [], removed: [] };
  }

  const versionsToAggregate = versions.slice(versionIdx, versions.length);
  const weightMap = new Map<
    string,
    { card: DeckCardDetails; weight: number }
  >();

  versionsToAggregate.forEach((version) => {
    version.cardDiff.added.forEach((diff) => {
      const entry = weightMap.get(diff.card.name);
      if (entry) {
        weightMap.set(diff.card.name, {
          ...entry,
          weight: entry.weight + diff.qty,
        });
      } else {
        weightMap.set(diff.card.name, { card: diff.card, weight: diff.qty });
      }
    });
    version.cardDiff.removed.forEach((diff) => {
      const entry = weightMap.get(diff.card.name);
      if (entry) {
        weightMap.set(diff.card.name, {
          ...entry,
          weight: entry.weight - diff.qty,
        });
      } else {
        weightMap.set(diff.card.name, { card: diff.card, weight: -diff.qty });
      }
    });
  });

  const aggregatedDiff: CardDiff = { added: [], removed: [] };
  for (const entry of weightMap.values()) {
    if (entry.weight < 0) {
      aggregatedDiff.removed.push({
        card: entry.card,
        qty: -entry.weight,
      });
    } else if (entry.weight > 0) {
      aggregatedDiff.added.push({
        card: entry.card,
        qty: entry.weight,
      });
    }
  }

  return aggregatedDiff;
}
