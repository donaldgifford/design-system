/**
 * The discipline test: component
 * files style through tokens, so a raw color, an arbitrary value, a
 * `rounded-full`, or a literal font size is a finding unless the allowlist
 * below names it with a reason. An allowlist entry that matches nothing
 * fails too, so the list only shrinks.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const componentsDir = join(import.meta.dir, "../src/components");

type Rule = "color" | "arbitrary" | "rounded-full" | "font-size";

interface Finding {
  file: string;
  rule: Rule;
  match: string;
}

interface Allowed {
  file: string;
  rule: Rule;
  /** The exact utility (or color literal) allowed in that file. */
  match: string;
  reason: string;
}

const layout = "layout mechanics, not a visual value";
const motion = "the properties a transition animates, not a visual value";
const recharts = "selectors over Recharts' default output; they match it, they set no color";
const diagram = "diagram geometry, matched to the drawing's fixed coordinates";
const stroke = "a marker's stroke, between the 1px hairline and 2px";
const iosZoom = "16px below md keeps iOS from zooming on focus";

/** What couldn't be removed, each with its reason. */
export const allowlist: readonly Allowed[] = [
  // Recharts draws its grid and cursor in these colors; the chart wrapper retargets them.
  { file: "ui/chart.tsx", rule: "color", match: "#ccc", reason: recharts },
  { file: "ui/chart.tsx", rule: "color", match: "#fff", reason: recharts },
  { file: "ui/chart.tsx", rule: "arbitrary", match: "border-[1.5px]", reason: stroke },
  // iOS zooms a focused field under 16px; the field is 16px below md.
  { file: "ui/input.tsx", rule: "font-size", match: "text-[1rem]", reason: iosZoom },
  { file: "ui/textarea.tsx", rule: "font-size", match: "text-[1rem]", reason: iosZoom },
  { file: "ui/dialog.tsx", rule: "arbitrary", match: "max-w-[calc(100%-2rem)]", reason: layout },
  { file: "ui/card.tsx", rule: "arbitrary", match: "grid-rows-[auto_auto]", reason: layout },
  { file: "ui/card.tsx", rule: "arbitrary", match: "grid-cols-[1fr_auto]", reason: layout },
  { file: "ui/alert.tsx", rule: "arbitrary", match: "grid-cols-[auto_1fr]", reason: layout },
  {
    file: "ui/scroll-area.tsx",
    rule: "arbitrary",
    match: "rounded-[inherit]",
    reason: "the viewport follows the root's radius",
  },
  {
    file: "ui/tooltip.tsx",
    rule: "arbitrary",
    match: "translate-y-[calc(-50%_-_2px)]",
    reason: "the arrow's offset onto the popup's edge",
  },
  {
    file: "ui/sidebar.tsx",
    rule: "arbitrary",
    match: "left-[calc(var(--sidebar-width)*-1)]",
    reason: layout,
  },
  {
    file: "ui/sidebar.tsx",
    rule: "arbitrary",
    match: "right-[calc(var(--sidebar-width)*-1)]",
    reason: layout,
  },
  {
    file: "ui/sidebar.tsx",
    rule: "arbitrary",
    match: "w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]",
    reason: layout,
  },
  {
    file: "ui/sidebar.tsx",
    rule: "arbitrary",
    match: "w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]",
    reason: layout,
  },
  {
    file: "ui/sidebar.tsx",
    rule: "arbitrary",
    match: "shadow-[0_0_0_1px_var(--sidebar-border)]",
    reason: "a 1px outline from the sidebar's tokens, drawn as a shadow so it takes no space",
  },
  {
    file: "ui/sidebar.tsx",
    rule: "arbitrary",
    match: "shadow-[0_0_0_1px_var(--sidebar-accent)]",
    reason: "a 1px outline from the sidebar's tokens, drawn as a shadow so it takes no space",
  },
  {
    file: "blocks/timeline.tsx",
    rule: "arbitrary",
    match: "left-[15px]",
    reason: "the rail under the avatars' centers",
  },
  {
    file: "blocks/timeline.tsx",
    rule: "arbitrary",
    match: "left-[calc(4.5rem+7px)]",
    reason: "the rail under the changelog's markers",
  },
  { file: "blocks/timeline.tsx", rule: "arbitrary", match: "border-[1.5px]", reason: stroke },
  { file: "blocks/flow.tsx", rule: "arbitrary", match: "w-[100px]", reason: diagram },
  { file: "blocks/flow.tsx", rule: "arbitrary", match: "w-[260px]", reason: diagram },
  { file: "blocks/flow.tsx", rule: "arbitrary", match: "h-[30px]", reason: diagram },
  { file: "blocks/flow.tsx", rule: "arbitrary", match: "size-[18px]", reason: diagram },
  { file: "blocks/flow.tsx", rule: "arbitrary", match: "bg-[size:18px_18px]", reason: diagram },
  {
    file: "blocks/flow.tsx",
    rule: "arbitrary",
    match:
      "bg-[radial-gradient(in_srgb,color-mix(in_oklch,var(--foreground)_13%,transparent)_1px,transparent_1px)]",
    reason: "the canvas's dot grid, drawn from --foreground",
  },
];

/** Motion lists are allowed wherever they appear. */
const anywhere: readonly { rule: Rule; pattern: RegExp; reason: string }[] = [
  { rule: "arbitrary", pattern: /^transition-\[[a-z,-]+\]$/, reason: motion },
];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    // Stories sit beside components but are fixtures, not component styling.
    return path.endsWith(".tsx") && !path.endsWith(".stories.tsx") ? [path] : [];
  });
}

/** The utility a class applies: what follows its last variant colon outside brackets. */
function utilityOf(token: string): string {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) start = i + 1;
  }
  return token.slice(start).replace(/^!|!$/g, "");
}

function scan(path: string): Finding[] {
  const file = relative(componentsDir, path);
  const text = readFileSync(path, "utf8");
  const findings: Finding[] = [];
  for (const m of text.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g)) {
    findings.push({ file, rule: "color", match: m[0] });
  }
  for (const token of text.split(/[\s"'`{}]+/)) {
    const utility = utilityOf(token);
    if (/^-?rounded(-[a-z]+)?-full$/.test(utility)) {
      findings.push({ file, rule: "rounded-full", match: utility });
    } else if (/^text-\[(\d|length:)/.test(utility)) {
      findings.push({ file, rule: "font-size", match: utility });
    } else if (/^-?[a-z][a-z0-9-]*-\[[^\]]+\](\/[\w.[\]]+)?$/.test(utility)) {
      findings.push({ file, rule: "arbitrary", match: utility });
    }
  }
  return findings;
}

const findings = files(componentsDir).flatMap(scan);

function allowed(finding: Finding): boolean {
  return (
    anywhere.some((entry) => entry.rule === finding.rule && entry.pattern.test(finding.match)) ||
    allowlist.some(
      (entry) =>
        entry.file === finding.file && entry.rule === finding.rule && entry.match === finding.match,
    )
  );
}

describe("component discipline", () => {
  test("no raw color, arbitrary value, rounded-full, or literal font size outside the allowlist", () => {
    const unexplained = findings
      .filter((finding) => !allowed(finding))
      .map((finding) => `${finding.file}: ${finding.rule} ${finding.match}`);
    expect(unexplained).toEqual([]);
  });

  test("every allowlist entry still matches something", () => {
    const stale = allowlist
      .filter(
        (entry) =>
          !findings.some(
            (finding) =>
              finding.file === entry.file &&
              finding.rule === entry.rule &&
              finding.match === entry.match,
          ),
      )
      .map((entry) => `${entry.file}: ${entry.match}`);
    expect(stale).toEqual([]);
  });

  test("every allowlist entry has a reason", () => {
    expect(allowlist.filter((entry) => entry.reason.trim() === "")).toEqual([]);
  });
});
