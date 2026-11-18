/**
 * The list page convention: a list's filter, sort, and page
 * live in the URL as typed search params, so a view is a link. This
 * module is the part a table needs and imports nothing; `lib/list-search`
 * adds the zod schema a route validates with.
 */
export interface ListSearch {
  page: number;
  size: number;
  /** A column id, with a leading `-` for descending. */
  sort?: string | undefined;
  /** The free-text filter. */
  q?: string | undefined;
}

export const listSearchDefaults = { page: 1, size: 25 } as const;

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
