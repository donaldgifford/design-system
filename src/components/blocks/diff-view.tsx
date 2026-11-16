import { type Language, tokenize } from "@donaldgifford/design-system/lib/highlight";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { tokenClass } from "./code-block";

export type DiffOp = "=" | "-" | "+";

export interface DiffLine {
  op: DiffOp;
  text: string;
  /** Line numbers in the old and new text; absent on the side that lacks the line. */
  oldNumber?: number | undefined;
  newNumber?: number | undefined;
}

/**
 * A line diff by longest common subsequence, enough for config files
 * and policy documents. Not for large files.
 */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.replace(/\n$/, "").split("\n");
  const b = after.replace(/\n$/, "").split("\n");
  const n = a.length;
  const m = b.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      const down = table[i + 1]?.[j] ?? 0;
      const right = table[i]?.[j + 1] ?? 0;
      const diag = table[i + 1]?.[j + 1] ?? 0;
      const row = table[i];
      if (row) {
        row[j] = a[i] === b[j] ? diag + 1 : Math.max(down, right);
      }
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let oldNumber = 0;
  let newNumber = 0;
  while (i < n && j < m) {
    const down = table[i + 1]?.[j] ?? 0;
    const right = table[i]?.[j + 1] ?? 0;
    if (a[i] === b[j]) {
      oldNumber++;
      newNumber++;
      out.push({ op: "=", text: a[i] ?? "", oldNumber, newNumber });
      i++;
      j++;
    } else if (down >= right) {
      oldNumber++;
      out.push({ op: "-", text: a[i] ?? "", oldNumber });
      i++;
    } else {
      newNumber++;
      out.push({ op: "+", text: b[j] ?? "", newNumber });
      j++;
    }
  }
  while (i < n) {
    oldNumber++;
    out.push({ op: "-", text: a[i] ?? "", oldNumber });
    i++;
  }
  while (j < m) {
    newNumber++;
    out.push({ op: "+", text: b[j] ?? "", newNumber });
    j++;
  }
  return out;
}

interface DiffViewProps {
  before: string;
  after: string;
  language?: Language | undefined;
  /** The file name in the header. */
  file?: string | undefined;
  className?: string | undefined;
}

const opClass: Record<DiffOp, string> = {
  "=": "",
  "-": "bg-diff-remove",
  "+": "bg-diff-add",
};
const markerClass: Record<DiffOp, string> = {
  "=": "text-muted-foreground",
  "-": "text-destructive",
  "+": "text-success",
};

/**
 * A unified diff with line numbers on both sides and the small highlighter
 * on each line. Any approve or reject actions belong to the page.
 */
export function DiffView({ before, after, language = "text", file, className }: DiffViewProps) {
  const lines = diffLines(before, after);
  const added = lines.filter((line) => line.op === "+").length;
  const removed = lines.filter((line) => line.op === "-").length;
  return (
    <div
      data-slot="diff-view"
      className={cn("overflow-hidden rounded-lg border bg-background font-mono text-xs", className)}
    >
      <div className="flex items-center gap-2 border-b bg-muted/60 px-3 py-1.5">
        <span className="truncate">{file ?? "diff"}</span>
        <span className="ml-auto text-success">+{added}</span>
        <span className="text-destructive">−{removed}</span>
      </div>
      <div className="overflow-x-auto bg-card">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional and never reorder
                key={index}
                data-op={line.op}
                className={opClass[line.op]}
              >
                <td className="w-10 select-none px-2 text-right text-muted-foreground tabular-nums">
                  {line.oldNumber ?? ""}
                </td>
                <td className="w-10 select-none px-2 text-right text-muted-foreground tabular-nums">
                  {line.newNumber ?? ""}
                </td>
                <td className={cn("w-4 select-none text-center", markerClass[line.op])}>
                  {line.op === "=" ? " " : line.op}
                </td>
                <td className="whitespace-pre pr-3 leading-5">
                  {tokenize(line.text, language).map((token, i) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: tokens are positional and never reorder
                      key={i}
                      data-token={token.kind}
                      className={tokenClass[token.kind]}
                    >
                      {token.text}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
