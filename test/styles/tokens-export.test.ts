import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { exportPath, exportTokens, render } from "../../scripts/tokens-export";
import { readStyle } from "./css-tokens";

const css = readStyle("tokens.css");

describe("the token export", () => {
  const tokens = exportTokens(css);

  test("tokens.json matches tokens.css (run just tokens after a token change)", () => {
    expect(readFileSync(exportPath, "utf8")).toBe(render(tokens));
  });

  test("both modes hold the same tokens", () => {
    expect(Object.keys(tokens.dark)).toEqual(Object.keys(tokens.light));
  });

  test("a token that is another token is an alias, and dark overrides light", () => {
    expect(tokens.light.background?.$value).toMatch(/^\{[\w-]+\}$/);
    expect(tokens.dark.background?.$value).toBe("{slate-21}");
    expect(tokens.light.background?.$value).not.toBe(tokens.dark.background?.$value);
  });

  test("types follow the resolved value", () => {
    expect(tokens.light.background?.$type).toBe("color");
    expect(tokens.light["control-h"]?.$type).toBe("dimension");
    expect(tokens.light["duration-fast"]?.$type).toBe("duration");
  });
});
