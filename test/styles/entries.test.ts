/**
 * The stylesheet entries. `globals.css` is the whole package: the fonts,
 * the core (tokens, theme map, base layer) and the classes of every
 * component. `core.css` is the core alone, for an app that names the
 * parts it uses and brings its own fonts. Both are compiled here the way
 * an app's Vite build compiles them.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import packageJson from "../../package.json";
import { type BuiltCss, buildCss } from "./build-css";
import { readStyle } from "./css-tokens";

const repo = join(import.meta.dir, "../..");
const styles = join(repo, "src/styles");

/** A stylesheet's statements outside its comments. */
function statements(file: string): string[] {
  return readStyle(file)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

/** A class only the sidebar uses, so its presence means the sidebar was scanned. */
const sidebarOnly = "collapsible\\=icon";

describe("the stylesheet entries", () => {
  test("globals.css is the fonts, the core and the package's sources", () => {
    expect(statements("globals.css")).toEqual([
      '@import "./fonts.css";',
      '@import "./core.css";',
      '@source "..";',
    ]);
  });

  test("fonts.css is only font imports", () => {
    const lines = statements("fonts.css");
    expect(lines).toHaveLength(5);
    for (const line of lines) expect(line).toMatch(/^@import "@fontsource\/[\w-]+\/[\w-]+\.css";$/);
  });

  test("core.css names no sources and no fonts", () => {
    const core = statements("core.css").join("\n");
    expect(core).not.toContain("@source");
    expect(core).not.toContain("@fontsource");
    expect(core).not.toContain("@font-face");
  });

  test("the package exports all three", () => {
    expect(packageJson.exports).toMatchObject({
      "./globals.css": "./src/styles/globals.css",
      "./core.css": "./src/styles/core.css",
      "./fonts.css": "./src/styles/fonts.css",
    });
  });
});

describe("an app that imports globals.css", () => {
  let built: BuiltCss;
  beforeAll(async () => {
    built = await buildCss(join(styles, "globals.css"), repo);
  });

  test("gets the fonts", () => {
    expect(built.css).toContain("@font-face");
    expect(built.assets.some((file) => file.endsWith(".woff2"))).toBe(true);
  });

  test("gets every component's classes", () => {
    expect(built.css).toContain(".badge-tinted");
    expect(built.css).toContain(sidebarOnly);
  });
});

describe("an app that imports core.css and names two components", () => {
  let app: string;
  let built: BuiltCss;
  beforeAll(async () => {
    app = mkdtempSync(join(tmpdir(), "design-system-core-"));
    const ui = join(repo, "src/components/ui");
    writeFileSync(
      join(app, "app.css"),
      [
        `@import "${join(styles, "core.css")}";`,
        `@source "${join(ui, "button.tsx")}";`,
        `@source "${join(ui, "badge.tsx")}";`,
      ].join("\n"),
    );
    built = await buildCss(join(app, "app.css"), app);
  });
  afterAll(() => {
    rmSync(app, { recursive: true, force: true });
  });

  test("gets the tokens and those components' classes", () => {
    expect(built.css).toContain("--category-1");
    expect(built.css).toContain(".badge-tinted");
  });

  test("gets no classes for the others", () => {
    expect(built.css).not.toContain(sidebarOnly);
  });

  test("emits no font files", () => {
    expect(built.css).not.toContain("@font-face");
    expect(built.assets).toEqual([]);
  });
});
