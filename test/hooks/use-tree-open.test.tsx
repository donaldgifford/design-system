import { describe, expect, test } from "bun:test";
import { useTreeOpen } from "@donaldgifford/design-system/hooks/use-tree-open";
import { act, renderHook } from "@testing-library/react";

type Key = string | readonly string[] | undefined;

const setup = (initial: Key) =>
  renderHook(({ activeKey }: { activeKey: Key }) => useTreeOpen(activeKey), {
    initialProps: { activeKey: initial },
  });

describe("useTreeOpen", () => {
  test("the active branch is open and the others are closed", () => {
    const { result } = setup("design");
    expect(result.current.isOpen("design")).toBe(true);
    expect(result.current.isOpen("rfc")).toBe(false);
  });

  test("with no active key, nothing is open", () => {
    const { result } = setup(undefined);
    expect(result.current.isOpen("design")).toBe(false);
  });

  test("a toggle by hand overrides the rule, both ways", () => {
    const { result } = setup("design");
    act(() => result.current.setOpen("design", false));
    act(() => result.current.setOpen("rfc", true));
    expect(result.current.isOpen("design")).toBe(false);
    expect(result.current.isOpen("rfc")).toBe(true);
  });

  test("overrides are dropped when the active key changes", () => {
    const { result, rerender } = setup("design");
    act(() => result.current.setOpen("design", false));
    act(() => result.current.setOpen("rfc", true));
    rerender({ activeKey: "adr" });
    expect(result.current.isOpen("adr")).toBe(true);
    expect(result.current.isOpen("rfc")).toBe(false);
    expect(result.current.isOpen("design")).toBe(false);
    // Back on the first branch, it is open again: the old override is gone.
    rerender({ activeKey: "design" });
    expect(result.current.isOpen("design")).toBe(true);
  });

  test("overrides hold while the active key stays the same", () => {
    const { result, rerender } = setup("design");
    act(() => result.current.setOpen("design", false));
    rerender({ activeKey: "design" });
    expect(result.current.isOpen("design")).toBe(false);
  });

  test("nested branches: every key that holds the page is open, and a new array is not a move", () => {
    const { result, rerender } = setup(["guides", "guides/install"]);
    expect(result.current.isOpen("guides")).toBe(true);
    expect(result.current.isOpen("guides/install")).toBe(true);
    expect(result.current.isOpen("reference")).toBe(false);
    act(() => result.current.setOpen("guides/install", false));
    rerender({ activeKey: ["guides", "guides/install"] });
    expect(result.current.isOpen("guides/install")).toBe(false);
    rerender({ activeKey: ["reference"] });
    expect(result.current.isOpen("guides")).toBe(false);
    expect(result.current.isOpen("reference")).toBe(true);
  });

  test("item() gives a row its open and onOpenChange", () => {
    const { result } = setup("design");
    expect(result.current.item("design").open).toBe(true);
    act(() => result.current.item("design").onOpenChange(false));
    expect(result.current.item("design").open).toBe(false);
  });
});
