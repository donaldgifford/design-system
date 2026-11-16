import { z } from "zod";

/** RFC 9457 problem details, with a `reason` extension for a machine-readable code. */
export const problemSchema = z.object({
  type: z.string().default("about:blank"),
  title: z.string().default(""),
  status: z.number().int(),
  detail: z.string().optional(),
  reason: z.string().optional(),
  requestId: z.string().optional(),
  /** The same id, as an API that names its fields in snake case sends it. */
  request_id: z.string().optional(),
});
export type Problem = z.infer<typeof problemSchema>;
export const problemContentType = "application/problem+json";

/** A problem's request id, under either spelling. */
export function problemRequestId(problem: Problem): string | undefined {
  return problem.requestId ?? problem.request_id;
}
