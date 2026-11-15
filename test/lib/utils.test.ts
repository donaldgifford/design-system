import { describe, expect, test } from "bun:test";
import { cn } from "@donaldgifford/design-system/lib/utils";

describe("cn", () => {
  test("keeps a theme label size beside a text color", () => {
    expect(cn("text-label-sm text-muted-foreground")).toBe("text-label-sm text-muted-foreground");
    expect(cn("text-label tracking-label text-foreground")).toBe(
      "text-label tracking-label text-foreground",
    );
  });

  test("a later size still wins over an earlier one", () => {
    expect(cn("text-label", "text-xs")).toBe("text-xs");
    expect(cn("tracking-label", "tracking-wide")).toBe("tracking-wide");
  });
});
