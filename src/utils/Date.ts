export function getLongDateString(date: string): string {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function isDateValid(date: string): boolean {
  return !isNaN(new Date(date).getTime());
}
