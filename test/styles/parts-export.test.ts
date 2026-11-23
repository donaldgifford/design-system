import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import packageJson from "../../package.json";
import { closure, exportParts, parts, partsDir } from "../../scripts/parts-export";

/** Every file under a directory, relative to it. */
function filesUnder(dir: string, prefix = ""): string[] {
  return readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesUnder(dir, `${prefix}${entry.name}/`) : [`${prefix}${entry.name}`],
  );
}

describe("the part stylesheets", () => {
  const generated = exportParts();

  test("src/styles/parts matches the imports (run just parts after changing one)", () => {
    expect(filesUnder(partsDir).sort()).toEqual([...generated.keys()].sort());
    for (const [path, css] of generated) {
      expect(readFileSync(join(partsDir, path), "utf8")).toBe(css);
    }
  });

  test("there is one for every component, block and shell part", () => {
    const names = parts().map(({ part }) => part);
    expect(names).toContain("components/button");
    expect(names).toContain("blocks/list-row");
    expect(names).toContain("shell/sidebar-tree");
    expect(names.some((name) => name.includes(".stories"))).toBe(false);
  });

  test("every line names a file that exists", () => {
    for (const [path, css] of generated) {
      const from = dirname(join(partsDir, path));
      for (const [, target] of css.matchAll(/@source "([^"]+)";/g)) {
        expect(existsSync(resolve(from, target ?? ""))).toBe(true);
      }
    }
  });

  test("a part's sheet names what it renders, however far down", () => {
    // The tree renders the sidebar, which renders the sheet and the tooltip.
    const tree = closure("components/shell/sidebar-tree.tsx");
    expect(tree[0]).toBe("components/shell/sidebar-tree.tsx");
    expect(tree).toContain("components/ui/sidebar.tsx");
    expect(tree).toContain("components/ui/sheet.tsx");
    expect(tree).toContain("components/ui/tooltip.tsx");
    expect(tree).not.toContain("components/ui/chart.tsx");
  });

  test("the package exports them", () => {
    expect(packageJson.exports).toMatchObject({ "./parts/*": "./src/styles/parts/*" });
  });
});
