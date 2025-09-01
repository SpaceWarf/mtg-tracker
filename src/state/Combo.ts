export interface Combo {
  name: string;
  href: string;
  cards: string[];
  bracket: "unavailable" | "any" | "3" | "4-5";
  results: string[];
}
