import { Bracket } from "./Bracket";

export interface BracketData {
  bracket: Bracket;
  description: string;
  rules: {
    icon: BracketRuleIcon;
    colour: "red" | "green" | "yellow";
    text: string;
  }[];
}

export enum BracketRuleIcon {
  CROSS_CIRCLE = "cross-circle",
  CHECK_CIRCLE = "check-circle",
  DOLLAR = "dollar",
}

export const BRACKET_DATA: BracketData[] = [
  {
    bracket: Bracket.PRECON,
    description: "A standard preconstructed deck",
    rules: [
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Mass Land Denial",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Chained Extra Turns",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Game Changers",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No 2-card Combos",
      },
      {
        icon: BracketRuleIcon.CHECK_CIRCLE,
        colour: "green",
        text: "Few Tutors",
      },
      {
        icon: BracketRuleIcon.DOLLAR,
        colour: "red",
        text: "No Upgrades",
      },
    ],
  },
  {
    bracket: Bracket.LOW_POWER,
    description: "An upgraded preconstructed deck",
    rules: [
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Mass Land Denial",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Chained Extra Turns",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Game Changers",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No 2-card Combos",
      },
      {
        icon: BracketRuleIcon.CHECK_CIRCLE,
        colour: "green",
        text: "Few Tutors",
      },
      {
        icon: BracketRuleIcon.DOLLAR,
        colour: "green",
        text: "100$ of upgrades",
      },
    ],
  },
  {
    bracket: Bracket.MID_POWER,
    description: "An optimized deck with no game changing effects",
    rules: [
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Mass Land Denial",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Chained Extra Turns",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Game Changers",
      },
      {
        icon: BracketRuleIcon.CHECK_CIRCLE,
        colour: "yellow",
        text: "No Early 2-card Combos",
      },
      {
        icon: BracketRuleIcon.CHECK_CIRCLE,
        colour: "green",
        text: "Few Tutors",
      },
      {
        icon: BracketRuleIcon.DOLLAR,
        colour: "green",
        text: "1000$ budget",
      },
    ],
  },
  {
    bracket: Bracket.HIGH_POWER,
    description: "An optimized deck with some game changing effects",
    rules: [
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Mass Land Denial",
      },
      {
        icon: BracketRuleIcon.CROSS_CIRCLE,
        colour: "red",
        text: "No Chained Extra Turns",
      },
      {
        icon: BracketRuleIcon.CHECK_CIRCLE,
        colour: "green",
        text: "Three Game Changers",
      },
      {
        icon: BracketRuleIcon.CHECK_CIRCLE,
        colour: "green",
        text: "Few 2-card Combos",
      },
      {
        icon: BracketRuleIcon.CHECK_CIRCLE,
        colour: "green",
        text: "Few Tutors",
      },
      {
        icon: BracketRuleIcon.DOLLAR,
        colour: "green",
        text: "1000$ budget",
      },
    ],
  },
];
