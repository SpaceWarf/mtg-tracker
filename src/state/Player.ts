import { DatabaseItem } from "./DatabaseItem";

export interface Player {
  name: string;
}

export interface DbPlayer extends Player, DatabaseItem {}
