import { readFileSync } from "node:fs";
import { join } from "node:path";

/** A custom property name, without the leading dashes, to its declared value. */
export type Scope = Map<string, string>;

const stylesDir = join(import.meta.dir, "../../src/styles");

export function readStyle(file: string): string {
  return readFileSync(join(stylesDir, file), "utf8");
}

/**
 * The top-level rules of a stylesheet as selector and custom property
 * declarations. Comments are dropped; at-rules (@media, @import) are
 * skipped with their blocks, so a reduced-motion override doesn't leak
 * into the default scope.
 */
export function rules(css: string): Array<{ selector: string; decls: Scope }> {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: Array<{ selector: string; decls: Scope }> = [];
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf("{", i);
    if (open === -1) break;
    const prelude = text.slice(i, open);
    // A statement at-rule (@import ...;) ends before the block's selector.
    const selector = prelude.slice(prelude.lastIndexOf(";") + 1).trim();
    let depth = 1;
    let close = open + 1;
    while (depth > 0 && close < text.length) {
      if (text[close] === "{") depth++;
      if (text[close] === "}") depth--;
      close++;
    }
    if (!selector.startsWith("@")) {
      const decls: Scope = new Map();
      for (const m of text.slice(open + 1, close - 1).matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
        decls.set(m[1] as string, (m[2] as string).trim().replace(/\s+/g, " "));
      }
      out.push({ selector, decls });
    }
    i = close;
  }
  return out;
}

/** Every custom property the rules matching `selector` declare, later rules winning. */
export function declared(css: string, selector: string): Scope {
  const scope: Scope = new Map();
  for (const rule of rules(css)) {
    if (rule.selector === selector) for (const [k, v] of rule.decls) scope.set(k, v);
  }
  return scope;
}

export function merge(...scopes: Scope[]): Scope {
  return new Map(scopes.flatMap((s) => [...s]));
}

/** A token's value with every var() resolved, or undefined when the chain breaks. */
export function resolve(scope: Scope, name: string, seen: string[] = []): string | undefined {
  if (seen.includes(name)) return undefined;
  const value = scope.get(name);
  if (value === undefined) return undefined;
  let broken = false;
  const out = value.replace(/var\(--([\w-]+)\)/g, (_, ref: string) => {
    const r = resolve(scope, ref, [...seen, name]);
    if (r === undefined) broken = true;
    return r ?? "";
  });
  return broken ? undefined : out;
}

/** oklch(L C H) to linear sRGB, clamped to the gamut. */
export function oklchToLinearSrgb(l: number, c: number, h: number): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  return [
    clamp(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    clamp(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    clamp(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  ];
}

/** WCAG relative luminance of a resolved oklch() value. */
export function luminance(color: string): number {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(color);
  if (!m) throw new Error(`not an opaque oklch() color: ${color}`);
  const [r, g, b] = oklchToLinearSrgb(Number(m[1]), Number(m[2]), Number(m[3]));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
