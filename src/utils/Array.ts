export function removeDuplicatesByKey<T>(arr: T[], key: keyof T): T[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uniqueMap = new Map<any, T>();
  for (const item of arr) {
    uniqueMap.set(item[key], item);
  }
  return Array.from(uniqueMap.values());
}
