import { describe, expect, test } from "bun:test";
import { contrast, declared, merge, readStyle, resolve, rules, type Scope } from "./css-tokens";

/*
 * The token schema and contrast pairs,
 * checked against tokens.css as the browser cascades it: :root for light,
 * :root plus .dark for dark.
 */

const tokens = readStyle("tokens.css");
const baseLight = declared(tokens, ":root");
const baseDark = merge(baseLight, declared(tokens, ".dark"));

const themes: Array<[string, Scope]> = [
  ["light", baseLight],
  ["dark", baseDark],
];

const range = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);

/** Colors that take a -foreground pair. */
const paired = [
  "background",
  "card",
  "popover",
  "muted",
  "accent",
  "secondary",
  "primary",
  "destructive",
  "success",
  "warning",
  "info",
  "pending",
  "approved",
  "ignored",
  "running",
];

/** The token schema: every token the package promises, by tier. */
const schema = [
  ...paired.flatMap((t) => [t, t === "background" ? "foreground" : `${t}-foreground`]),
  "ring",
  "input",
  "border",
  ...range("chart-", 5),
  "code-bg",
  "diff-add",
  "diff-remove",
  "radius",
  "badge-radius",
  "header-height",
  "control-h",
  "row-h",
  "table-row-h",
  ...range("space-", 8),
  ...["xs", "sm", "base", "lg", "xl"].map((s) => `text-${s}`),
  "duration-fast",
  "duration-normal",
  "ease-standard",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-accent",
  "sidebar-border",
  "sidebar-ring",
];

/** Text pairs at 4.5:1: foreground over background. */
const textPairs: Array<[string, string]> = [
  ["foreground", "background"],
  ...paired.filter((t) => t !== "background").map((t): [string, string] => [`${t}-foreground`, t]),
  ["muted-foreground", "card"],
  ["muted-foreground", "background"],
  ["sidebar-foreground", "sidebar"],
];

/** Non-text pairs at 3:1: the focus ring against the surfaces it draws on. */
const ringPairs: Array<[string, string]> = [
  ["ring", "background"],
  ["ring", "card"],
];

describe.each(themes)("%s", (_, scope) => {
  test.each(schema)("--%s is defined", (name) => {
    expect(resolve(scope, name)).toBeDefined();
  });

  test.each(textPairs)("--%s on --%s is at least 4.5:1", (fg, bg) => {
    const ratio = contrast(resolve(scope, fg) ?? "", resolve(scope, bg) ?? "");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test.each(ringPairs)("--%s on --%s is at least 3:1", (fg, bg) => {
    const ratio = contrast(resolve(scope, fg) ?? "", resolve(scope, bg) ?? "");
    expect(ratio).toBeGreaterThanOrEqual(3);
  });
});

describe("the themes", () => {
  const root = rules(tokens).filter((r) => r.selector === ":root");
  const dark = rules(tokens).filter((r) => r.selector === ".dark");
  // Raw, semantic, component on :root; semantic and component on .dark.
  const tiers: Array<[string, Scope, Scope]> = [
    ["semantic", root[1]?.decls ?? new Map(), dark[0]?.decls ?? new Map()],
    ["component", root[2]?.decls ?? new Map(), dark[1]?.decls ?? new Map()],
  ];

  test.each(tiers)("dark sets every %s color light sets", (_, light, darkDecls) => {
    const colors = [...light.keys()].filter((k) =>
      /^(oklch|color-mix)\(/.test(resolve(baseLight, k) ?? ""),
    );
    expect(colors.length).toBeGreaterThan(0);
    expect(colors.filter((k) => !darkDecls.has(k))).toEqual([]);
  });
});
