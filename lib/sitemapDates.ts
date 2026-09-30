/** A shared updatedAt this common is a batch write, not a per-article edit. */
export const BULK_UPDATED_AT_THRESHOLD = 20;

export function validDate(
  value: Date | string | null | undefined
): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Timestamps shared by a bulk write should not be used as lastmod. */
export function bulkUpdatedAtMillis(
  dates: Array<Date | null | undefined>
): Set<number> {
  const counts = new Map<number, number>();
  for (const value of dates) {
    const date = validDate(value);
    if (!date) continue;
    const millis = date.getTime();
    counts.set(millis, (counts.get(millis) || 0) + 1);
  }

  const bulk = new Set<number>();
  Array.from(counts.entries()).forEach(([millis, count]) => {
    if (count >= BULK_UPDATED_AT_THRESHOLD) bulk.add(millis);
  });
  return bulk;
}

/**
 * Prefer a real per-item updatedAt. A timestamp shared by a batch write is
 * ignored in favour of createdAt or publishedAt. Returns null when no date exists.
 */
export function contentLastMod(
  item: {
    updatedAt?: Date | string | null;
    createdAt?: Date | string | null;
    publishedAt?: Date | string | null;
  },
  bulkUpdatedAt: Set<number>
): Date | null {
  const updated = validDate(item.updatedAt);
  const published = validDate(item.publishedAt) || validDate(item.createdAt);
  if (updated && !bulkUpdatedAt.has(updated.getTime())) return updated;
  return published;
}

export function laterDate(
  current: Date | null | undefined,
  next: Date | null | undefined
): Date | null {
  if (!next) return current || null;
  if (!current || next.getTime() > current.getTime()) return next;
  return current;
}

export function maxDate(
  dates: Array<Date | null | undefined>
): Date | null {
  return dates.reduce<Date | null>(
    (current, date) => laterDate(current, date),
    null
  );
}
