import { z } from "zod";

/** RFC 9457 problem details, with a `reason` extension for a machine-readable code. */
export const problemSchema = z.object({
  type: z.string().default("about:blank"),
  title: z.string().default(""),
  status: z.number().int(),
  detail: z.string().optional(),
  reason: z.string().optional(),
  requestId: z.string().optional(),
});
export type Problem = z.infer<typeof problemSchema>;
export const problemContentType = "application/problem+json";
