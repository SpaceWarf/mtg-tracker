export function getAmountIntlString(
  amount: number,
  singular: string,
  plural: string
): string {
  if (amount === 1) {
    return singular;
  }
  return plural;
}
