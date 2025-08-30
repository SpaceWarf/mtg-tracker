import { IdentityColour } from "./IdentityColour";

export enum IdentityLabel {
  // Mono-Colour
  WHITE = "Mono-White (W)",
  BLUE = "Mono-Blue (U)",
  BLACK = "Mono-Black (B)",
  RED = "Mono-Red (R)",
  GREEN = "Mono-Green (G)",
  COLORLESS = "Colorless (C)",
  // 2-Colour
  AZORIUS = "Azorius (WU)",
  BOROS = "Boros (WR)",
  DIMIR = "Dimir (UB)",
  GOLGARI = "Golgari (BG)",
  GRUUL = "Gruul (RG)",
  IZZET = "Izzet (UR)",
  ORZHOV = "Orzhov (WB)",
  RAKDOS = "Rakdos (BR)",
  SELESNYA = "Selesnya (WG)",
  SIMIC = "Simic (UG)",
  // 3-Colour
  ABZAN = "Abzan (WBG)",
  BANT = "Bant (WUG)",
  ESPER = "Esper (WUB)",
  GRIXIS = "Grixis (UBR)",
  JESKAI = "Jeskai (WUR)",
  JUND = "Jund (BRG)",
  MARDU = "Mardu (WBR)",
  NAYA = "Naya (WRG)",
  SULTAI = "Sultai (UBG)",
  TEMUR = "Temur (URG)",
  // 4-Colour
  DUNE_BROOD = "Dune-Brood (WBRG)",
  GLINT_EYE = "Glint-Eye (UBRG)",
  INK_TREADER = "Ink-Treader (WURG)",
  WITCH_MAW = "Witch-Maw (WUBG)",
  YORE_TILLER = "Yore-Tiller (WUBR)",
  // 5-Colour
  FIVE_COLOR = "Five-Color (WUBRG)",
}

export const IDENTITY_LABEL_MAP: { [key in IdentityLabel]: IdentityColour[] } =
  {
    [IdentityLabel.WHITE]: [IdentityColour.WHITE],
    [IdentityLabel.BLUE]: [IdentityColour.BLUE],
    [IdentityLabel.BLACK]: [IdentityColour.BLACK],
    [IdentityLabel.RED]: [IdentityColour.RED],
    [IdentityLabel.GREEN]: [IdentityColour.GREEN],
    [IdentityLabel.COLORLESS]: [],
    [IdentityLabel.GRIXIS]: [
      IdentityColour.BLUE,
      IdentityColour.BLACK,
      IdentityColour.RED,
    ],
    [IdentityLabel.DIMIR]: [IdentityColour.BLUE, IdentityColour.BLACK],
    [IdentityLabel.JESKAI]: [
      IdentityColour.WHITE,
      IdentityColour.BLUE,
      IdentityColour.RED,
    ],
    [IdentityLabel.BANT]: [
      IdentityColour.WHITE,
      IdentityColour.GREEN,
      IdentityColour.BLUE,
    ],
    [IdentityLabel.ESPER]: [
      IdentityColour.WHITE,
      IdentityColour.BLUE,
      IdentityColour.BLACK,
    ],
    [IdentityLabel.NAYA]: [
      IdentityColour.WHITE,
      IdentityColour.RED,
      IdentityColour.GREEN,
    ],
    [IdentityLabel.MARDU]: [
      IdentityColour.WHITE,
      IdentityColour.BLACK,
      IdentityColour.RED,
    ],
    [IdentityLabel.ABZAN]: [
      IdentityColour.WHITE,
      IdentityColour.BLACK,
      IdentityColour.GREEN,
    ],
    [IdentityLabel.TEMUR]: [
      IdentityColour.BLUE,
      IdentityColour.RED,
      IdentityColour.GREEN,
    ],
    [IdentityLabel.SULTAI]: [
      IdentityColour.BLUE,
      IdentityColour.BLACK,
      IdentityColour.GREEN,
    ],
    [IdentityLabel.JUND]: [
      IdentityColour.BLACK,
      IdentityColour.RED,
      IdentityColour.GREEN,
    ],
    [IdentityLabel.SIMIC]: [IdentityColour.BLUE, IdentityColour.GREEN],
    [IdentityLabel.SELESNYA]: [IdentityColour.WHITE, IdentityColour.GREEN],
    [IdentityLabel.RAKDOS]: [IdentityColour.RED, IdentityColour.BLACK],
    [IdentityLabel.ORZHOV]: [IdentityColour.WHITE, IdentityColour.BLACK],
    [IdentityLabel.IZZET]: [IdentityColour.BLUE, IdentityColour.RED],
    [IdentityLabel.GRUUL]: [IdentityColour.RED, IdentityColour.GREEN],
    [IdentityLabel.GOLGARI]: [IdentityColour.BLACK, IdentityColour.GREEN],
    [IdentityLabel.BOROS]: [IdentityColour.RED, IdentityColour.WHITE],
    [IdentityLabel.AZORIUS]: [IdentityColour.WHITE, IdentityColour.BLUE],
    [IdentityLabel.YORE_TILLER]: [
      IdentityColour.WHITE,
      IdentityColour.BLUE,
      IdentityColour.RED,
      IdentityColour.BLACK,
    ],
    [IdentityLabel.GLINT_EYE]: [
      IdentityColour.BLUE,
      IdentityColour.RED,
      IdentityColour.GREEN,
      IdentityColour.BLACK,
    ],
    [IdentityLabel.DUNE_BROOD]: [
      IdentityColour.WHITE,
      IdentityColour.RED,
      IdentityColour.GREEN,
      IdentityColour.BLACK,
    ],
    [IdentityLabel.INK_TREADER]: [
      IdentityColour.WHITE,
      IdentityColour.BLUE,
      IdentityColour.RED,
      IdentityColour.GREEN,
    ],
    [IdentityLabel.WITCH_MAW]: [
      IdentityColour.WHITE,
      IdentityColour.BLUE,
      IdentityColour.BLACK,
      IdentityColour.GREEN,
    ],
    [IdentityLabel.FIVE_COLOR]: [
      IdentityColour.WHITE,
      IdentityColour.BLUE,
      IdentityColour.BLACK,
      IdentityColour.RED,
      IdentityColour.GREEN,
    ],
  };
