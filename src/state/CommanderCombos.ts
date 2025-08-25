import { CachedDatabaseItem } from "./DatabaseItem";

export interface CommanderCombos {
  commander: string;
  combos: Combo[];
}

export interface Combo {
  name: string;
  href: string;
  cards: string[];
}

export interface DbCommanderCombos
  extends CommanderCombos,
    CachedDatabaseItem {}
