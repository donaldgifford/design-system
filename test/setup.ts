// Test preload for `bun test` (bunfig.toml): a DOM via happy-dom, the
// jest-dom matchers on Bun's expect, and Testing Library cleanup after each
// test. Component tests import from "bun:test" and "@testing-library/react".
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register({ url: "http://localhost:5173/" });

const { afterEach, expect } = await import("bun:test");
const matchers = await import("@testing-library/jest-dom/matchers");
const { cleanup } = await import("@testing-library/react");

// jest-dom types its matchers for Jest's expect; Bun's expect.extend takes
// the same shape at runtime. The namespace import carries a `default`
// re-export that is not a matcher, so it is dropped.
const { default: _default, ...named } = matchers;
expect.extend(named as unknown as Parameters<typeof expect.extend>[0]);
afterEach(() => {
  cleanup();
});
