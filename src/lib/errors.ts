import { type Problem, problemContentType, problemSchema } from "./problem";

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
      const parsed = problemSchema.safeParse(await response.json().catch(() => null));
      if (parsed.success) {
        const p = parsed.data;
        return new ApiError(
          p.status,
          p.reason,
          p.detail ?? p.title ?? `HTTP ${p.status}`,
          p.requestId,
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
