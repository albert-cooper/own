/** Unique zero-based indices; never returns an out-of-range index. */
export function randomGames(length: number, total: number): number[] {
  if (!Number.isInteger(length) || length <= 0 || !Number.isFinite(total) || total <= 0) return [];
  const indices = Array.from({ length }, (_, index) => index);
  const count = Math.min(length, Math.floor(total));
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (length - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
}

/** Chunk a list without mutating shared imported JSON data. */
export function splitGames<T>(items: readonly T[], size = 6): T[][] {
  if (!Number.isInteger(size) || size <= 0) throw new RangeError("Chunk size must be a positive integer");
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, (i + 1) * size));
}
