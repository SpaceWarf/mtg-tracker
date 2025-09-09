import { cloneDeep } from "lodash";
import { uuidv7 } from "uuidv7";
import { CardDiff, CardDiffItem } from "../state/CardDiff";
import { DbDeck, DeckMatchup, DeckWithStats } from "../state/Deck";
import { DeckCardDetails, DeckDetails } from "../state/DeckDetails";
import { DeckVersion } from "../state/DeckVersion";
import { DbGame } from "../state/Game";
import { IDENTITY_LABEL_MAP, IdentityLabel } from "../state/IdentityLabel";
import { getBracket, getBracketName } from "./Bracket";
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
  return commanders.join(" & ");
}

export function getVisibleCards(deck: DbDeck): DeckCardDetails[] {
  const visibleCategories = deck.categories?.filter(
    (cat) => cat.includedInDeck
  );
  return (
    deck.cards?.filter((card) =>
      visibleCategories?.some((cat) => cat.name === card.category)
    ) ?? []
  );
}

export function getDeckGameChanger(
  deck: DbDeck,
  gameChangers: DeckCardDetails[]
): DeckCardDetails[] {
  const visibleCards = getVisibleCards(deck);
  return gameChangers.filter((card) =>
    visibleCards.some((c) => c.name === card.name)
  );
}

export function getDeckMassLandDenial(deck: DbDeck): DeckCardDetails[] {
  const visibleCards = getVisibleCards(deck);
  return visibleCards.filter((card) => card.massLandDenial);
}

export function getDeckExtraTurn(deck: DbDeck): DeckCardDetails[] {
  const visibleCards = getVisibleCards(deck);
  return visibleCards.filter((card) => card.extraTurns);
}

export function getDeckTutor(deck: DbDeck): DeckCardDetails[] {
  const visibleCards = getVisibleCards(deck);
  return visibleCards.filter((card) => card.tutor);
}

export function getColourIdentityLabel(
  colourIdentity: string[],
  type?: string
): IdentityLabel {
  if (!colourIdentity.length || type?.includes("Land")) {
    return IdentityLabel.COLORLESS;
  }

  return Object.keys(IDENTITY_LABEL_MAP).find((identity) => {
    const identityColours = IDENTITY_LABEL_MAP[identity as IdentityLabel];
    return identityColours.sort().join(",") === colourIdentity.sort().join(",");
  }) as IdentityLabel;
}

export function getDeckDescriptorString(deck: DeckWithStats): string {
  const bracket = getBracket(deck);
  const identityLabel = getColourIdentityLabel(deck.colourIdentity ?? []);
  return `${getBracketName(bracket)} ${identityLabel.split(" ")[0]} ${
    deck.format
  } Deck`;
}

export function getDeckMatchups(
  deck: DbDeck,
  games: DbGame[]
): Record<string, DeckMatchup> {
  const matchups: Record<string, DeckMatchup> = {};
  const playedGames = games.filter((game) =>
    [
      game.player1.deck,
      game.player2.deck,
      game.player3.deck,
      game.player4.deck,
    ].includes(deck.id)
  );

  playedGames.forEach((game) => {
    const players = [game.player1, game.player2, game.player3, game.player4];
    const self = players.find((player) => player.deck === deck.id);

    players.forEach((player) => {
      if (player.deck !== deck.id) {
        const won = (matchups[player.deck]?.won ?? 0) + (self?.won ? 1 : 0);
        const lost = (matchups[player.deck]?.lost ?? 0) + (self?.won ? 0 : 1);
        const played = won + lost;
        const winRate = played > 0 ? won / played : 0;

        matchups[player.deck] = {
          deck: player.deck,
          played,
          won,
          lost,
          winRate,
        };
      }
    });
  });

  return matchups;
}

export function getDeckGoodMatchups(deck: DeckWithStats): DeckMatchup[] {
  return Object.values(deck.matchups)
    .sort(
      (a, b) => b.winRate - a.winRate || b.played - a.played || b.won - a.won
    )
    .filter((matchup) => matchup.won > 0)
    .slice(0, 5);
}

export function getDeckBadMatchups(deck: DeckWithStats): DeckMatchup[] {
  return Object.values(deck.matchups)
    .sort(
      (a, b) => a.winRate - b.winRate || b.played - a.played || a.lost - b.lost
    )
    .filter((matchup) => matchup.lost > 0)
    .slice(0, 5);
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
  return mergeDiffs(versionsToAggregate);
}

export function mergeDiffs(versions: DeckVersion[]): CardDiff {
  const weightMap = new Map<
    string,
    { card: DeckCardDetails; weight: number }
  >();

  versions.forEach((version) => {
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

export function mergeVersions(versions: DeckVersion[]): DeckVersion {
  return {
    id: uuidv7(),
    createdAt: versions[versions.length - 1].createdAt,
    cardDiff: mergeDiffs(versions),
  };
}

export function populateDeck(
  deck: DbDeck,
  games: DbGame[],
  gameChangers: DeckCardDetails[]
): DeckWithStats {
  return {
    ...cloneDeep(deck),
    gamesPlayed: getDeckGamesCount(deck, games),
    winCount: getDeckWinCount(deck, games),
    winRate: getDeckWinRate(deck, games),
    gameChangers: getDeckGameChanger(deck, gameChangers),
    massLandDenials: getDeckMassLandDenial(deck),
    extraTurns: getDeckExtraTurn(deck),
    tutors: getDeckTutor(deck),
    combos: (deck.possibleCombos ?? []).filter((possibleCombo) =>
      possibleCombo.cards.every((comboCard) =>
        deck.cards?.find((card) => card.name === comboCard)
      )
    ),
    matchups: getDeckMatchups(deck, games),
  };
}

export function populateDeckDetails(
  deckDetails: DeckDetails,
  gameChangers: DeckCardDetails[]
): DeckWithStats {
  const deck: DbDeck = {
    ...deckDetails,
    externalId: deckDetails.id,
    name: deckDetails.title,
    gameChangersDeck: false,
    latestVersionId: "",
    versions: [],
    cards: deckDetails.cards,
    categories: deckDetails.categories,
    deckCreatedAt: deckDetails.createdAt,
    deckUpdatedAt: deckDetails.updatedAt,
  };
  return populateDeck(deck, [], gameChangers);
}

export function getSanitizedCommanderString(commander: string): string {
  return commander
    .split(" // ")[0]
    .replace(" & ", "-")
    .replace(/ /g, "-")
    .replace(/(,|'|")/g, "")
    .toLowerCase();
}

export function getDeckCommanders(deck: DbDeck): DeckCardDetails[] {
  return (
    deck.cards
      ?.filter((card) => deck.commander?.split(" & ")?.includes(card.name))
      .sort((a, b) => a.name.localeCompare(b.name)) ?? []
  );
}
