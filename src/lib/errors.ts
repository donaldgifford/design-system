/** RFC 9457 problem details, with a `reason` extension for a machine-readable code. */
export interface Problem {
  type: string;
  title: string;
  status: number;
  detail?: string | undefined;
  reason?: string | undefined;
  requestId?: string | undefined;
  /** The same id, as an API that names its fields in snake case sends it. */
  request_id?: string | undefined;
}

export const problemContentType = "application/problem+json";

/** A problem's request id, under either spelling. */
export function problemRequestId(problem: Problem): string | undefined {
  return problem.requestId ?? problem.request_id;
}

const optionalText = ["detail", "reason", "requestId", "request_id"] as const;

/**
 * Reads a problem from a parsed JSON body, or undefined when it is not
 * one. It accepts what `problemSchema` in `lib/problem` accepts, without
 * the schema library, so showing an error does not bring that along.
 */
export function parseProblem(body: unknown): Problem | undefined {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return undefined;
  const raw = body as Record<string, unknown>;
  const { type = "about:blank", title = "", status } = raw;
  if (typeof type !== "string" || typeof title !== "string") return undefined;
  if (typeof status !== "number" || !Number.isSafeInteger(status)) return undefined;
  const problem: Problem = { type, title, status };
  for (const key of optionalText) {
    const value = raw[key];
    if (value === undefined) continue;
    if (typeof value !== "string") return undefined;
    problem[key] = value;
  }
  return problem;
}

/**
 * A failed call to an API: the HTTP status,
 * the `reason` code when the body was a problem, and a message for the
 * UI. An app's shell maps these (401 to sign-in, 403 to the inline denial,
 * and so on); apps mostly read `reason`.
 */
export class ApiError extends Error {
  override readonly name = "ApiError";

  constructor(
    readonly status: number,
    readonly reason: string | undefined,
    message: string,
    readonly requestId?: string,
    readonly problem?: Problem,
  ) {
    super(message);
  }

  /** Builds the error from a response, reading a problem body when there is one. */
  static async from(response: Response): Promise<ApiError> {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.startsWith(problemContentType) || contentType.startsWith("application/json")) {
      const p = parseProblem(await response.json().catch(() => null));
      if (p) {
        return new ApiError(
          p.status,
          p.reason,
          p.detail ?? p.title ?? `HTTP ${p.status}`,
          problemRequestId(p) ?? response.headers.get("x-request-id") ?? undefined,
          p,
        );
      }
    }
    const requestId = response.headers.get("x-request-id") ?? undefined;
    return new ApiError(response.status, undefined, `HTTP ${response.status}`, requestId);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
