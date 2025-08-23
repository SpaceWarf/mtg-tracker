import { Bracket } from "../state/Bracket";
import { DeckWithStats } from "../state/Deck";

export const MASS_LAND_DENIAL_LIMIT: number = 0;
export const GAME_CHANGER_LIMIT: number = 3;
export const TUTOR_LIMIT: number = 9999;
export const EXTRA_TURN_LIMIT: number = 9999;

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

  if (deck.gameChangers.length > 0) {
    return Bracket.HIGH_POWER;
  }

  return Bracket.MID_POWER;
}

export function getBracketDetails(deck: DeckWithStats): string[] {
  const details: string[] = [];

  if (deck.gameChangers.length > GAME_CHANGER_LIMIT) {
    details.push(
      `More than ${GAME_CHANGER_LIMIT} game changers (${deck.gameChangers.length})`
    );
  } else if (
    GAME_CHANGER_LIMIT > 0 &&
    GAME_CHANGER_LIMIT !== 9999 &&
    deck.gameChangers.length > 0
  ) {
    details.push(
      `Has ${getIntervalString(1, GAME_CHANGER_LIMIT)} game changers (${
        deck.gameChangers.length
      })`
    );
  }

  if (deck.tutors.length > TUTOR_LIMIT) {
    details.push(`More than ${TUTOR_LIMIT} tutors (${deck.tutors.length})`);
  } else if (
    TUTOR_LIMIT > 0 &&
    TUTOR_LIMIT !== 9999 &&
    deck.tutors.length > 0
  ) {
    details.push(
      `Has ${getIntervalString(1, TUTOR_LIMIT)} tutors (${deck.tutors.length})`
    );
  }

  if (deck.extraTurns.length > EXTRA_TURN_LIMIT) {
    details.push(
      `More than ${EXTRA_TURN_LIMIT} extra turns (${deck.extraTurns.length})`
    );
  } else if (
    EXTRA_TURN_LIMIT > 0 &&
    EXTRA_TURN_LIMIT !== 9999 &&
    deck.extraTurns.length > 0
  ) {
    details.push(
      `Has ${getIntervalString(1, EXTRA_TURN_LIMIT)} extra turns (${
        deck.extraTurns.length
      })`
    );
  }

  if (deck.massLandDenials.length > MASS_LAND_DENIAL_LIMIT) {
    details.push(
      `More than ${MASS_LAND_DENIAL_LIMIT} mass land denials (${deck.massLandDenials.length})`
    );
  } else if (
    MASS_LAND_DENIAL_LIMIT > 0 &&
    MASS_LAND_DENIAL_LIMIT !== 9999 &&
    deck.massLandDenials.length > 0
  ) {
    details.push(
      `Has ${getIntervalString(1, MASS_LAND_DENIAL_LIMIT)} mass land denials (${
        deck.massLandDenials.length
      })`
    );
  }

  return details;
}

function getIntervalString(from: number, to: number): string {
  if (from === to) {
    return `${from}`;
  }
  return `1-${to}`;
}
