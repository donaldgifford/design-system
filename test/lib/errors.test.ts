import { describe, expect, test } from "bun:test";
import { ApiError, isApiError } from "@donaldgifford/design-system/lib/errors";

describe("ApiError.from", () => {
  test("reads a problem body", async () => {
    const res = new Response(
      JSON.stringify({
        type: "about:blank",
        title: "Forbidden",
        status: 403,
        detail: "not entitled to apps",
        reason: "NOT_ENTITLED",
        requestId: "req-1",
      }),
      { status: 403, headers: { "content-type": "application/problem+json" } },
    );
    const err = await ApiError.from(res);
    expect(err.status).toBe(403);
    expect(err.reason).toBe("NOT_ENTITLED");
    expect(err.message).toBe("not entitled to apps");
    expect(err.requestId).toBe("req-1");
    expect(isApiError(err)).toBe(true);
  });

  test("falls back to the status for other bodies", async () => {
    const res = new Response("<html>", {
      status: 502,
      headers: { "content-type": "text/html", "x-request-id": "req-2" },
    });
    const err = await ApiError.from(res);
    expect(err.status).toBe(502);
    expect(err.reason).toBeUndefined();
    expect(err.message).toBe("HTTP 502");
    expect(err.requestId).toBe("req-2");
  });

  test("tolerates a JSON body that is not a problem", async () => {
    const res = new Response("{}", {
      status: 500,
      headers: { "content-type": "application/json" },
    });
    const err = await ApiError.from(res);
    expect(err.status).toBe(500);
    expect(err.reason).toBeUndefined();
  });
});
