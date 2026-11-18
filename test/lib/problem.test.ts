import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { parseProblem } from "@donaldgifford/design-system/lib/errors";
import { problemSchema } from "@donaldgifford/design-system/lib/problem";

const bodies: unknown[] = [
  { status: 404 },
  { type: "https://example.test/not-found", title: "Not Found", status: 404, detail: "gone" },
  { status: 403, reason: "NOT_ENTITLED", requestId: "a", request_id: "b", extra: true },
  { status: 500, title: "" },
  { title: "No status" },
  { status: "404" },
  { status: 404.5 },
  { status: Number.MAX_SAFE_INTEGER + 2 },
  { status: 404, title: 7 },
  { status: 404, type: null },
  { status: 404, detail: null },
  { status: 404, reason: 1 },
  { status: 404, request_id: {} },
  [],
  [{ status: 404 }],
  null,
  undefined,
  "problem",
  404,
];

describe("parseProblem", () => {
  test.each(bodies.map((body) => [JSON.stringify(body) ?? "undefined", body] as const))(
    "agrees with problemSchema on %s",
    (_name, body) => {
      const parsed = problemSchema.safeParse(body);
      expect(parseProblem(body)).toEqual(parsed.success ? parsed.data : undefined);
    },
  );

  test("fills the defaults and drops what is not part of a problem", () => {
    expect(parseProblem({ status: 404, extra: true })).toEqual({
      type: "about:blank",
      title: "",
      status: 404,
    });
  });
});

describe("lib/errors", () => {
  test("imports nothing, so an ErrorState does not bundle the schema library", () => {
    const source = readFileSync(new URL("../../src/lib/errors.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/^import /m);
  });
});
