import { z } from "zod";
import type { Problem } from "./errors";

export type { Problem } from "./errors";
export { parseProblem, problemContentType, problemRequestId } from "./errors";

/**
 * The problem as a zod schema, for an app that validates with zod.
 * `lib/errors` reads the same shape by hand (`parseProblem`), so an app
 * that only shows errors does not bundle zod.
 */
export const problemSchema = z.object({
  type: z.string().default("about:blank"),
  title: z.string().default(""),
  status: z.number().int(),
  detail: z.string().optional(),
  reason: z.string().optional(),
  requestId: z.string().optional(),
  request_id: z.string().optional(),
}) satisfies z.ZodType<Problem>;
