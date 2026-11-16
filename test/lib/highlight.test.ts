import { describe, expect, test } from "bun:test";
import { type Language, tokenize } from "@donaldgifford/design-system/lib/highlight";

const samples: Record<Language, string> = {
  json: '{"a": [1, true, null], "b": "x"}',
  yaml: "# comment\nname: prod-1\nready: true\nnodes:\n  - 3\n",
  shell: 'just dev-up # start\nexport FOO="bar"\nkubectl --profile x get pods',
  hcl: 'cluster "prod" {\n  region = "us-west-2" // here\n  nodes  = 3\n}\n',
  text: "plain",
};

describe("tokenize", () => {
  test("concatenated tokens reproduce the source for every language", () => {
    for (const [language, source] of Object.entries(samples) as [Language, string][]) {
      expect(
        tokenize(source, language)
          .map((t) => t.text)
          .join(""),
      ).toBe(source);
    }
  });

  test("picks out keys, strings, numbers, keywords, and comments", () => {
    const kinds = (language: Language) =>
      new Map(tokenize(samples[language], language).map((t) => [t.text, t.kind]));
    expect(kinds("json").get('"a"')).toBe("key");
    expect(kinds("json").get('"x"')).toBe("string");
    expect(kinds("json").get("1")).toBe("number");
    expect(kinds("json").get("null")).toBe("keyword");
    expect(kinds("yaml").get("# comment")).toBe("comment");
    expect(kinds("yaml").get("name")).toBe("key");
    expect(kinds("yaml").get("true")).toBe("keyword");
    expect(kinds("shell").get("just")).toBe("keyword");
    expect(kinds("shell").get("--profile")).toBe("key");
    expect(kinds("shell").get('"bar"')).toBe("string");
    expect(kinds("hcl").get("region")).toBe("key");
    expect(kinds("hcl").get("// here")).toBe("comment");
    expect(kinds("hcl").get("cluster")).toBe("keyword");
    expect(tokenize("", "text")).toEqual([]);
  });
});
