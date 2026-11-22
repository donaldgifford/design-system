import { describe, expect, test } from "bun:test";
import { markSegments } from "@donaldgifford/design-system/lib/mark";

describe("markSegments", () => {
  test("splits a snippet into marked and unmarked runs, in order", () => {
    expect(markSegments("the <em>shell</em> in repo-guardian's <em>look</em>")).toEqual([
      { text: "the ", marked: false },
      { text: "shell", marked: true },
      { text: " in repo-guardian's ", marked: false },
      { text: "look", marked: true },
    ]);
  });

  test("a string with no markers is one unmarked run, and an empty string is none", () => {
    expect(markSegments("plain text")).toEqual([{ text: "plain text", marked: false }]);
    expect(markSegments("")).toEqual([]);
  });

  test("a marker with attributes is not a marker", () => {
    expect(markSegments('<em class="x">shell</em>')).toEqual([
      { text: '<em class="x">shell', marked: false },
    ]);
  });

  test("other tags and entities stay text", () => {
    const hostile = '<script>alert(1)</script> <img src=x onerror="alert(1)"> &lt;b&gt;';
    expect(markSegments(hostile)).toEqual([{ text: hostile, marked: false }]);
    expect(markSegments("<em><script>alert(1)</script></em>")).toEqual([
      { text: "<script>alert(1)</script>", marked: true },
    ]);
  });

  test("nested and back-to-back markers are one run", () => {
    expect(markSegments("<em>a<em>b</em>c</em>d")).toEqual([
      { text: "abc", marked: true },
      { text: "d", marked: false },
    ]);
    expect(markSegments("<em>a</em><em>b</em>")).toEqual([{ text: "ab", marked: true }]);
  });

  test("an unbalanced closer is ignored and an unclosed opener marks to the end", () => {
    expect(markSegments("a</em>b<em>c</em>d")).toEqual([
      { text: "ab", marked: false },
      { text: "c", marked: true },
      { text: "d", marked: false },
    ]);
    expect(markSegments("a<em>b")).toEqual([
      { text: "a", marked: false },
      { text: "b", marked: true },
    ]);
  });

  test("the markers are case-sensitive", () => {
    expect(markSegments("<EM>shell</EM>")).toEqual([{ text: "<EM>shell</EM>", marked: false }]);
  });
});
