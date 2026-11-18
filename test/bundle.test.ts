/**
 * zod stays out of an app's bundle unless the app asks for it. A schema
 * is built when its module loads, which a bundler cannot drop, so the
 * rule is about imports: only the two schema modules import zod, and no
 * component or other lib module imports them.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const src = new URL("../src/", import.meta.url).pathname;
const schemaModules = ["lib/problem.ts", "lib/list-search.ts"];

const files = (readdirSync(src, { recursive: true }) as string[])
  .filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".stories.tsx"))
  .map((file) => relative(src, join(src, file)));

/** Module specifiers a file imports or re-exports at runtime (not `import type`). */
function runtimeImports(file: string): string[] {
  const source = readFileSync(join(src, file), "utf8");
  const found = source.matchAll(/^(?:import|export)\s+(?!type\b)[^;]*?from\s+"([^"]+)"/gms);
  return [...found].map((match) => match[1] as string);
}

describe("zod in the bundle", () => {
  test("only the schema modules import zod", () => {
    const importers = files.filter((file) => runtimeImports(file).includes("zod"));
    expect(importers.sort()).toEqual([...schemaModules].sort());
  });

  test("nothing in the package imports a schema module", () => {
    const reaches = (specifier: string) => /(^|\/)(problem|list-search)$/.test(specifier);
    const importers = files.filter((file) => runtimeImports(file).some(reaches));
    expect(importers).toEqual([]);
  });
});
