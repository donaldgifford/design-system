import { describe, expect, test } from "bun:test";
import {
  compactSearch,
  formatSort,
  listSearchSchema,
  parseSort,
} from "@donaldgifford/design-system/lib/list-search";

describe("list search", () => {
  test("the schema defaults and repairs each param independently", () => {
    expect(listSearchSchema.parse({})).toEqual({ page: 1, size: 25 });
    expect(listSearchSchema.parse({ page: 0, size: 999, sort: "", q: "" })).toEqual({
      page: 1,
      size: 25,
    });
    expect(listSearchSchema.parse({ page: 3, size: 50, sort: "-name", q: "prod" })).toEqual({
      page: 3,
      size: 50,
      sort: "-name",
      q: "prod",
    });
  });

  test("sort round-trips through the param", () => {
    expect(parseSort("name")).toEqual({ id: "name", desc: false });
    expect(parseSort("-name")).toEqual({ id: "name", desc: true });
    expect(parseSort(undefined)).toBeUndefined();
    expect(parseSort("-")).toBeUndefined();
    expect(formatSort("cpu", true)).toBe("-cpu");
    expect(formatSort("cpu", false)).toBe("cpu");
  });

  test("compactSearch drops defaults and empties", () => {
    expect(compactSearch({ page: 1, size: 25, sort: undefined, q: "", id: "sbx_1" })).toEqual({
      id: "sbx_1",
    });
    expect(compactSearch({ page: 2, size: 25, q: "x" })).toEqual({ page: 2, q: "x" });
  });
});
