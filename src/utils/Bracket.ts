import { Bracket } from "../state/Bracket";
import { DeckWithStats } from "../state/Deck";

export const MASS_LAND_DENIAL_LIMIT: number = 0;
export const GAME_CHANGER_LIMIT: number = 3;
export const TUTOR_LIMIT: number = 9999;
export const EXTRA_TURN_LIMIT: number = 9999;
export const TWO_CARD_COMBO_LIMIT: number = 9999;

export function getBracket(deck: DeckWithStats) {
  if (deck.gameChangers.length > GAME_CHANGER_LIMIT) {
    return Bracket.ILLEGAL;
  }

  if (deck.tutors.length > TUTOR_LIMIT) {
    return Bracket.ILLEGAL;
  }

  if (deck.extraTurns.length > EXTRA_TURN_LIMIT) {
    return Bracket.ILLEGAL;
  }

  if (deck.massLandDenials.length > MASS_LAND_DENIAL_LIMIT) {
    return Bracket.ILLEGAL;
  }

  if (deck.combos.length > TWO_CARD_COMBO_LIMIT) {
    return Bracket.ILLEGAL;
  }

  if (deck.gameChangers.length > 0) {
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
  }

  return details;
}
