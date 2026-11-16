/**
 * A small highlighter for short snippets: JSON, YAML, shell,
 * and HCL. It tokenizes with a few regular expressions per language; it is
 * not a parser and does not need to be. A token's `kind` maps to a token
 * color in CodeBlock.
 */
export type TokenKind = "comment" | "string" | "number" | "key" | "keyword" | "punct" | "text";

export interface Token {
  kind: TokenKind;
  text: string;
}

export type Language = "json" | "yaml" | "shell" | "hcl" | "text";

const rules: Record<Exclude<Language, "text">, [TokenKind, RegExp][]> = {
  json: [
    ["key", /"(?:[^"\\]|\\.)*"(?=\s*:)/y],
    ["string", /"(?:[^"\\]|\\.)*"/y],
    ["number", /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y],
    ["keyword", /\b(?:true|false|null)\b/y],
    ["punct", /[{}[\],:]/y],
  ],
  yaml: [
    ["comment", /#[^\n]*/y],
    ["key", /(?<=^[ \t]*(?:-[ \t]+)?)[A-Za-z0-9_.\-/]+(?=:(?:\s|$))/my],
    ["string", /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y],
    ["number", /\b-?\d+(?:\.\d+)?\b/y],
    ["keyword", /\b(?:true|false|null|yes|no|on|off)\b/y],
    ["punct", /[:\-|>[\]{},]/y],
  ],
  shell: [
    ["comment", /#[^\n]*/y],
    ["string", /"(?:[^"\\]|\\.)*"|'[^']*'/y],
    [
      "keyword",
      /(?:^|(?<=[\s;|&]))(?:just|kubectl|helm|docker|git|export|if|then|fi|for|do|done|echo|cd)\b/my,
    ],
    ["key", /(?:^|(?<=\s))--?[A-Za-z][\w-]*/my],
    ["number", /\b\d+\b/y],
    ["punct", /[|&;<>$()=]/y],
  ],
  hcl: [
    ["comment", /#[^\n]*|\/\/[^\n]*/y],
    ["string", /"(?:[^"\\]|\\.)*"/y],
    ["key", /(?<=^[ \t]*)[A-Za-z_][\w-]*(?=\s*=)/my],
    ["keyword", /\b(?:true|false|null)\b|(?<=^[ \t]*)[a-z_]+(?=\s+(?:"[^"]*"\s*)*\{)/my],
    ["number", /\b-?\d+(?:\.\d+)?\b/y],
    ["punct", /[{}[\]=,()]/y],
  ],
};

/** Tokenizes source for a language; unknown text passes through as `text`. */
export function tokenize(source: string, language: Language): Token[] {
  if (language === "text") {
    return source === "" ? [] : [{ kind: "text", text: source }];
  }
  const tokens: Token[] = [];
  let pos = 0;
  let text = "";
  const flush = () => {
    if (text !== "") {
      tokens.push({ kind: "text", text });
      text = "";
    }
  };
  while (pos < source.length) {
    let matched = false;
    for (const [kind, re] of rules[language]) {
      re.lastIndex = pos;
      const m = re.exec(source);
      if (m !== null && m[0] !== "" && m.index === pos) {
        flush();
        tokens.push({ kind, text: m[0] });
        pos += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      text += source[pos];
      pos++;
    }
  }
  flush();
  return tokens;
}
