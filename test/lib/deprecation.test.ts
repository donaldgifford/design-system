import { afterEach, describe, expect, spyOn, test } from "bun:test";
import {
  type Deprecation,
  deprecationMessage,
  deprecations,
  deprecationsOf,
  warnDeprecated,
} from "@donaldgifford/design-system/lib/deprecation";

const pending: Deprecation = {
  component: "Badge",
  what: 'variant="pending"',
  instead: 'variant="warning"',
};
const size: Deprecation = { component: "Button", what: 'size="xs"', instead: 'size="sm"' };

describe("deprecation", () => {
  const nodeEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = nodeEnv;
  });

  test("nothing is deprecated yet", () => {
    expect(deprecations).toEqual([]);
  });

  test("deprecationsOf picks one component's entries", () => {
    expect(deprecationsOf("Badge", [pending, size])).toEqual([pending]);
    expect(deprecationsOf("Card", [pending, size])).toEqual([]);
  });

  test("warns once per deprecation in development", () => {
    process.env.NODE_ENV = "development";
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    warnDeprecated(pending);
    warnDeprecated(pending);
    warnDeprecated(size);
    expect(warn.mock.calls).toEqual([[deprecationMessage(pending)], [deprecationMessage(size)]]);
    warn.mockRestore();
  });

  test("stays quiet in production", () => {
    process.env.NODE_ENV = "production";
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    warnDeprecated({ ...pending, what: 'variant="approved"' });
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  test("the message names the replacement", () => {
    expect(deprecationMessage(pending)).toBe(
      '@donaldgifford/design-system: Badge variant="pending" is deprecated and goes in the next major; use variant="warning".',
    );
  });
});
