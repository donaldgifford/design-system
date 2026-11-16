import { z } from "zod";

/**
 * The list page convention: a list's filter, sort, and page
 * live in the URL as typed search params, so a view is a link. A route
 * validates with `listSearchSchema` (or extends it) and a page binds a
 * DataTable to its router, which writes the URL.
 */
export const listSearchDefaults = { page: 1, size: 25 } as const;

export const listSearchSchema = z.object({
  page: z.number().int().min(1).catch(listSearchDefaults.page),
  size: z.number().int().min(5).max(200).catch(listSearchDefaults.size),
  /** A column id, with a leading `-` for descending. */
  sort: z.string().min(1).optional().catch(undefined),
  /** The free-text filter. */
  q: z.string().min(1).optional().catch(undefined),
});
export type ListSearch = z.infer<typeof listSearchSchema>;

/** Parses the `sort` param into a column id and direction. */
export function parseSort(sort: string | undefined): { id: string; desc: boolean } | undefined {
  if (sort === undefined || sort === "" || sort === "-") {
    return undefined;
  }
  return sort.startsWith("-") ? { id: sort.slice(1), desc: true } : { id: sort, desc: false };
}

/** Formats a column id and direction as the `sort` param. */
export function formatSort(id: string, desc: boolean): string {
  return desc ? `-${id}` : id;
}

/** Drops defaults and empties so URLs stay short: `/sandboxes` not `/sandboxes?page=1&size=25`. */
export function compactSearch<T extends Record<string, unknown>>(search: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(search) as [keyof T, T[keyof T]][]) {
    if (value === undefined || value === "" || value === null) {
      continue;
    }
    if (
      key in listSearchDefaults &&
      value === listSearchDefaults[key as keyof typeof listSearchDefaults]
    ) {
      continue;
    }
    out[key] = value;
  }
  return out;
}
