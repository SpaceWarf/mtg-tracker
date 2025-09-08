import { Bracket } from "../state/Bracket";
import { DeckWithStats } from "../state/Deck";

export const MASS_LAND_DENIAL_LIMIT: number = 0;
export const GAME_CHANGER_LIMIT: number = 3;
export const TUTOR_LIMIT: number = 9999;
export const EXTRA_TURN_LIMIT: number = 9999;
export const TWO_CARD_COMBO_LIMIT: number = 9999;
export const CARD_COUNT: number = 100;

export function getBracketName(bracket: Bracket): string {
  switch (bracket) {
    case Bracket.PRECON:
      return "Precon";
    case Bracket.LOW_POWER:
      return "Low-Power";
    case Bracket.MID_POWER:
      return "Mid-Power";
    case Bracket.HIGH_POWER:
      return "High-Power";
    case Bracket.ILLEGAL:
      return "Illegal";
  }
}

export function getBracket(deck: DeckWithStats): Bracket {
  if (deck.bracket) {
    return deck.bracket;
  }

  const tooManyGameChangers = deck.gameChangers.length > GAME_CHANGER_LIMIT;
  const tooManyTutors = deck.tutors.length > TUTOR_LIMIT;
  const tooManyExtraTurns = deck.extraTurns.length > EXTRA_TURN_LIMIT;
  const tooManyMassLandDenials =
    deck.massLandDenials.length > MASS_LAND_DENIAL_LIMIT;
  const tooMany2CardCombos = deck.combos.length > TWO_CARD_COMBO_LIMIT;
  const tooManyCards = parseInt(deck.size ?? "0") > CARD_COUNT;
  const notEnoughCards = parseInt(deck.size ?? "0") < CARD_COUNT;

  if (
    tooManyGameChangers ||
    tooManyTutors ||
    tooManyExtraTurns ||
    tooManyMassLandDenials ||
    tooMany2CardCombos ||
    tooManyCards ||
    notEnoughCards
  ) {
    return Bracket.ILLEGAL;
  }

  const hasEarly2CardCombo = deck.combos.some(
    (combo) => combo.cards.length === 2 && combo.bracket === "4-5"
  );
  const hasGameChanger = deck.gameChangers.length > 0;

  if (hasEarly2CardCombo || hasGameChanger) {
    return Bracket.HIGH_POWER;
  }

  return Bracket.MID_POWER;
}

export function getBracketDetails(deck: DeckWithStats): string[] {
  const details: string[] = [];
  const bracket = getBracket(deck);

  if (bracket === Bracket.ILLEGAL) {
    if (deck.gameChangers.length > GAME_CHANGER_LIMIT) {
      details.push(
        `More than ${GAME_CHANGER_LIMIT} game changers (${deck.gameChangers.length})`
      );
    }

    if (deck.tutors.length > TUTOR_LIMIT) {
      details.push(`More than ${TUTOR_LIMIT} tutors (${deck.tutors.length})`);
    }

    if (deck.extraTurns.length > EXTRA_TURN_LIMIT) {
      details.push(
        `More than ${EXTRA_TURN_LIMIT} extra turns (${deck.extraTurns.length})`
      );
    }

    if (deck.massLandDenials.length > MASS_LAND_DENIAL_LIMIT) {
      details.push(
        `More than ${MASS_LAND_DENIAL_LIMIT} mass land denials (${deck.massLandDenials.length})`
      );
    }

    if (deck.combos.length > TWO_CARD_COMBO_LIMIT) {
      details.push(
        `More than ${TWO_CARD_COMBO_LIMIT} two card combos (${deck.combos.length})`
      );
    }

    if (parseInt(deck.size ?? "0") > CARD_COUNT) {
      details.push(`More than ${CARD_COUNT} cards (${deck.size})`);
    }

    if (parseInt(deck.size ?? "0") < CARD_COUNT) {
      details.push(`Less than ${CARD_COUNT} cards (${deck.size})`);
    }
  }

  if (bracket === Bracket.HIGH_POWER) {
    if (deck.gameChangers.length > 0) {
      details.push(`Has game changers (${deck.gameChangers.length})`);
    }

    const early2CardCombo = deck.combos.filter(
      (combo) => combo.cards.length === 2 && combo.bracket === "4-5"
    );
    if (early2CardCombo.length > 0) {
      details.push(`Has early game 2-card combos (${early2CardCombo.length})`);
    }
  }

  return details;
}
