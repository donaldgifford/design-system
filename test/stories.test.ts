/**
 * The story coverage check: every module the exports map
 * publishes as a component (`components/*`, `blocks/*`, `shell/*`) has a
 * `*.stories.tsx` beside it, so a new component can't skip Storybook.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const componentsDir = join(import.meta.dir, "../src/components");

/** The exports map's component directories: components/* is ui/. */
const exported = ["ui", "blocks", "shell"];

const modules = exported.flatMap((dir) =>
  readdirSync(join(componentsDir, dir))
    .filter((name) => name.endsWith(".tsx") && !name.endsWith(".stories.tsx"))
    .map((name) => `${dir}/${name}`),
);

describe("story coverage", () => {
  test("finds the component modules", () => {
    expect(modules.length).toBeGreaterThan(40);
  });

  test("every exported component module has a story file", () => {
    const missing = modules.filter(
      (module) => !existsSync(join(componentsDir, module.replace(/\.tsx$/, ".stories.tsx"))),
    );
    expect(missing).toEqual([]);
  });
});
