import { z } from "zod";
import { type ListSearch, listSearchDefaults } from "./list-params";

export type { ListSearch } from "./list-params";
export { compactSearch, formatSort, listSearchDefaults, parseSort } from "./list-params";

/**
 * The list search as a zod schema: a route validates with it (or extends
 * it), and a page binds a DataTable to its router, which writes the URL.
 * The rest of the convention is in `lib/list-params`, which a table uses
 * without bringing zod along.
 */
export const listSearchSchema = z.object({
  page: z.number().int().min(1).catch(listSearchDefaults.page),
  size: z.number().int().min(5).max(200).catch(listSearchDefaults.size),
  sort: z.string().min(1).optional().catch(undefined),
  q: z.string().min(1).optional().catch(undefined),
}) satisfies z.ZodType<ListSearch>;
