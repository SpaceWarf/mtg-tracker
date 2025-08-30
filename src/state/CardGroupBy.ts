export enum CardGroupBy {
  CATEGORY = "category",
  TYPE = "type",
  COLOUR = "colour",
}

export const CardGroupByOptions = {
  [CardGroupBy.CATEGORY]: {
    label: "Category",
    value: CardGroupBy.CATEGORY,
  },
  [CardGroupBy.TYPE]: {
    label: "Type",
    value: CardGroupBy.TYPE,
  },
  [CardGroupBy.COLOUR]: {
    label: "Colour",
    value: CardGroupBy.COLOUR,
  },
};
