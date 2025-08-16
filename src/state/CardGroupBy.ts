export enum CardGroupBy {
  CATEGORY = "category",
  TYPE = "type",
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
};
