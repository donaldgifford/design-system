/**
 * The token export: tokens.css as W3C Design Tokens (DTCG) JSON, with light
 * and dark as modes. Each mode holds every token: `:root`'s values, and for
 * dark the `.dark` overrides on top. A token that is another token is a
 * DTCG alias (`{slate-21}`). Values stay as the CSS has them (oklch, rem,
 * ms), with `$type` where the resolved value has one.
 *
 * `just tokens` writes tokens.json, and a test fails when it and the CSS
 * disagree, so the JSON is never edited by hand.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
// The token tests' parser, so the export and the tests read tokens.css the same way.
import { declared, merge, readStyle, resolve, type Scope } from "../test/styles/css-tokens";

interface Token {
  $type?: string;
  $value: unknown;
}

type Mode = Record<string, Token>;

export interface TokenExport {
  $description: string;
  light: Mode;
  dark: Mode;
}

export const exportPath = join(import.meta.dir, "../tokens.json");

/** The DTCG type of a resolved CSS value, when it has one. */
function typeOf(value: string): string | undefined {
  if (/^(oklch|color-mix)\(|^(white|black|transparent)$/.test(value)) return "color";
  if (/^-?[\d.]+(rem|px|em)$/.test(value)) return "dimension";
  if (/^[\d.]+m?s$/.test(value)) return "duration";
  if (/^cubic-bezier\(/.test(value)) return "cubicBezier";
  if (/^-?[\d.]+$/.test(value)) return "number";
  if (/,/.test(value) && /^["'\w]/.test(value) && !/\(/.test(value)) return "fontFamily";
  return undefined;
}

function scopes(css: string): { light: Scope; dark: Scope } {
  const light = declared(css, ":root");
  return { light, dark: merge(light, declared(css, ".dark")) };
}

function mode(scope: Scope): Mode {
  const out: Mode = {};
  for (const name of [...scope.keys()].sort()) {
    const value = scope.get(name) as string;
    const alias = /^var\(--([\w-]+)\)$/.exec(value);
    const $type = typeOf(resolve(scope, name) ?? value);
    out[name] = {
      ...($type ? { $type } : {}),
      $value: alias ? `{${alias[1]}}` : value,
    };
  }
  return out;
}

export function exportTokens(css: string): TokenExport {
  const { light, dark } = scopes(css);
  return {
    $description: "Generated from src/styles/tokens.css by `just tokens`; do not edit by hand.",
    light: mode(light),
    dark: mode(dark),
  };
}

export function render(tokens: object): string {
  return `${JSON.stringify(tokens, null, 2)}\n`;
}

if (import.meta.main) {
  writeFileSync(exportPath, render(exportTokens(readStyle("tokens.css"))));
  console.warn(`wrote ${exportPath}`);
}
