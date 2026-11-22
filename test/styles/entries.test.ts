/**
 * The stylesheet entries. `globals.css` is the whole package: the fonts,
 * the core (tokens, theme map, base layer) and the classes of every
 * component. `core.css` is the core alone, for an app that names the
 * parts it uses and brings its own fonts. Both are compiled here the way
 * an app's Vite build compiles them.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
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

/**
 * A scratch app with the package where an install puts it: a real copy
 * under the app's own `node_modules`, imported by name. The place matters.
 * Tailwind ignores `node_modules`, and when the app's root is scanned by
 * itself, a line that names one file in there opens that file's whole
 * directory. With `source(none)` on the import nothing is scanned unasked,
 * and each line means the file it names.
 */
function scratchApp(appCss: string[]): string {
  // The real path: through a symlinked temp directory the package would not
  // look like it is inside the app, and the scan would not be the app's.
  const app = realpathSync(mkdtempSync(join(tmpdir(), "design-system-core-")));
  const installed = join(app, "node_modules/@donaldgifford/design-system");
  cpSync(join(repo, "src"), join(installed, "src"), { recursive: true });
  cpSync(join(repo, "package.json"), join(installed, "package.json"));
  // What core.css imports by name, resolved from the app as an install would.
  for (const dependency of ["tailwindcss", "tw-animate-css"]) {
    symlinkSync(join(repo, "node_modules", dependency), join(app, "node_modules", dependency));
  }
  mkdirSync(join(app, "src"));
  writeFileSync(
    join(app, "src/page.tsx"),
    'export const page = <p className="underline-offset-8" />;\n',
  );
  writeFileSync(join(app, "src/app.css"), appCss.join("\n"));
  return app;
}

const installedUi = "../node_modules/@donaldgifford/design-system/src/components/ui";

describe("an app that imports core.css and names two components", () => {
  let app: string;
  let built: BuiltCss;
  beforeAll(async () => {
    // The README's lines, "Only the parts you use".
    app = scratchApp([
      '@import "@donaldgifford/design-system/core.css" source(none);',
      '@source "./";',
      `@source "${installedUi}/button.tsx";`,
      `@source "${installedUi}/badge.tsx";`,
    ]);
    built = await buildCss(join(app, "src/app.css"), app);
  });
  afterAll(() => {
    rmSync(app, { recursive: true, force: true });
  });

  test("gets the tokens and those components' classes", () => {
    expect(built.css).toContain("--category-1");
    expect(built.css).toContain(".badge-tinted");
  });

  test("gets its own classes", () => {
    expect(built.css).toContain(".underline-offset-8");
  });

  test("gets no classes for the others", () => {
    expect(built.css).not.toContain(sidebarOnly);
  });

  test("emits no font files", () => {
    expect(built.css).not.toContain("@font-face");
    expect(built.assets).toEqual([]);
  });
});
