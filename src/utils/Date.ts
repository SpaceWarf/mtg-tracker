export function getLongDateString(date: string, longMonth = true): string {
  if (date === "") {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: longMonth ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getShortDateString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function isDateValid(date: string): boolean {
  return !isNaN(new Date(date).getTime());
}

export function getDateTimeString(date: string): string {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });
}
