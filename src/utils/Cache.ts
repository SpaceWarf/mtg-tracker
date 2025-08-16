/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheKey } from "../state/CacheKey";

export function getCacheKey(key: CacheKey): Map<string, any> {
  const value = localStorage.getItem(`${key}`);
  return value
    ? new Map(Object.entries(JSON.parse(value)))
    : new Map<string, any>();
}

export function setCacheKey(key: CacheKey, value: Map<string, any>) {
  localStorage.setItem(`${key}`, JSON.stringify(Object.fromEntries(value)));
}

export function getItemFromCache<T>(
  cache: Map<string, any>,
  id: string
): T | null {
  const item = cache.get(id);

  if (!item || new Date(item.expiry) < new Date()) {
    return null;
  }

  return item.value as T;
}
