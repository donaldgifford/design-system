import { Button } from "@donaldgifford/design-system/components/button";
import {
  type Language,
  type Token,
  type TokenKind,
  tokenize,
} from "@donaldgifford/design-system/lib/highlight";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: Language;
  /** A caption above the code, for example a file name. */
  title?: string;
  /** Numbers each line down the left; for policy documents and long files. */
  lineNumbers?: boolean;
  className?: string;
}

/** The highlighter's token kinds as text colors; shared with the diff viewer. */
export const tokenClass: Record<TokenKind, string> = {
  comment: "text-muted-foreground italic",
  string: "text-chart-2",
  number: "text-chart-4",
  key: "text-chart-1",
  keyword: "text-chart-5",
  punct: "text-muted-foreground",
  text: "",
};

/** Splits a token stream at newlines, so each line can be rendered as a row. */
export function splitLines(tokens: readonly Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    const parts = token.text.split("\n");
    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push([]);
      }
      if (part !== "") {
        lines[lines.length - 1]?.push({ kind: token.kind, text: part });
      }
    });
  }
  // A trailing newline leaves an empty last line that is not a line.
  if (lines.length > 1 && lines[lines.length - 1]?.length === 0) {
    lines.pop();
  }
  return lines;
}

function Tokens({ tokens }: { tokens: readonly Token[] }) {
  return (
    <>
      {tokens.map((token, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: tokens are positional and never reorder
        <span key={i} data-token={token.kind} className={tokenClass[token.kind]}>
          {token.text}
        </span>
      ))}
    </>
  );
}

/** Monospace code with the small highlighter, a copy button, and optional line numbers. */
export function CodeBlock({
  code,
  language = "text",
  title,
  lineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const tokens = tokenize(code, language);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // No clipboard (insecure context, permissions): the text is still selectable.
    }
  };
  return (
    <div
      data-slot="code-block"
      className={cn("overflow-hidden rounded-lg border bg-code-bg font-mono", className)}
    >
      <div
        data-slot="code-block-header"
        className="flex items-center justify-between border-b bg-muted px-3 py-1 text-label"
      >
        <span className="font-mono text-muted-foreground text-xs">{title ?? language}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={copied ? "Copied" : "Copy"}
          onClick={() => void copy()}
        >
          {copied ? <IconCheck aria-hidden="true" /> : <IconCopy aria-hidden="true" />}
        </Button>
      </div>
      <pre className="overflow-x-auto py-2 font-mono text-xs leading-5">
        <code data-language={language} className={cn(lineNumbers ? "block" : "block px-3")}>
          {lineNumbers ? (
            splitLines(tokens).map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional and never reorder
              <span key={index} className="flex">
                <span
                  aria-hidden="true"
                  className="w-10 shrink-0 select-none pr-3 text-right text-muted-foreground tabular-nums"
                >
                  {index + 1}
                </span>
                <span className="flex-1 whitespace-pre pr-3">
                  <Tokens tokens={line} />
                </span>
              </span>
            ))
          ) : (
            <Tokens tokens={tokens} />
          )}
        </code>
      </pre>
    </div>
  );
}
