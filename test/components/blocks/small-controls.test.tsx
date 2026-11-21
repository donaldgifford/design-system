import { describe, expect, mock, test } from "bun:test";
import { FilterBar } from "@donaldgifford/design-system/blocks/filter-bar";
import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import { InlineEmpty, InlineLoading } from "@donaldgifford/design-system/blocks/inline-state";
import {
  OptionHeading,
  OptionItem,
  OptionSeparator,
} from "@donaldgifford/design-system/blocks/option-rows";
import { SegmentedControl } from "@donaldgifford/design-system/blocks/segmented-control";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

type Range = "24h" | "7d" | "30d";
const ranges: readonly { value: Range; label: string }[] = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

function Ranges({ onValueChange }: { onValueChange: (value: Range) => void }) {
  const [value, setValue] = useState<Range>("7d");
  return (
    <SegmentedControl
      label="Range"
      options={ranges}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
    />
  );
}

describe("SegmentedControl", () => {
  test("is a named tab list with the value selected", async () => {
    const { container } = render(
      <main>
        <Ranges onValueChange={() => {}} />
      </main>,
    );
    const list = screen.getByRole("tablist", { name: "Range" });
    expect(within(list).getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "7d" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "24h" })).toHaveAttribute("aria-selected", "false");
    await expectNoA11yViolations(container);
  });

  test("reports a click and an arrow key as the new value", async () => {
    const user = userEvent.setup();
    const onValueChange = mock((_: Range) => {});
    render(<Ranges onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "30d" }));
    expect(onValueChange).toHaveBeenLastCalledWith("30d");
    expect(screen.getByRole("tab", { name: "30d" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenLastCalledWith("7d");
  });

  test("puts className on the list", () => {
    render(
      <SegmentedControl
        label="Range"
        options={ranges}
        value="7d"
        onValueChange={() => {}}
        className="ml-auto"
      />,
    );
    expect(screen.getByRole("tablist")).toHaveClass("ml-auto");
  });
});

describe("OptionRows", () => {
  test("a row is a button with its detail; the current one says so", async () => {
    const user = userEvent.setup();
    const onPick = mock(() => {});
    const { container } = render(
      <main>
        <OptionHeading>Owner</OptionHeading>
        <OptionItem current detail="318">
          All owners
        </OptionItem>
        <OptionItem detail="112" onClick={onPick}>
          payments
        </OptionItem>
        <OptionSeparator />
        <OptionItem disabled onClick={onPick}>
          platform
        </OptionItem>
      </main>,
    );
    const current = screen.getByRole("button", { name: /All owners/ });
    expect(current).toHaveAttribute("aria-current", "true");
    expect(current).toHaveAttribute("type", "button");
    expect(current.querySelector("svg")).not.toBeNull();
    const other = screen.getByRole("button", { name: /payments/ });
    expect(other).not.toHaveAttribute("aria-current");
    expect(other.querySelector("svg")).toBeNull();
    expect(other).toHaveTextContent("112");
    await user.click(other);
    expect(onPick).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "platform" }));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("separator")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("FilterBar", () => {
  test("is a named group around its chips, with Clear and the count", async () => {
    const user = userEvent.setup();
    const onClear = mock(() => {});
    const { container } = render(
      <main>
        <FilterBar onClear={onClear} count="23 of 318">
          <FilterChip name="org" value="payments" />
          <FilterChip />
        </FilterBar>
      </main>,
    );
    const bar = screen.getByRole("group", { name: "Filters" });
    expect(within(bar).getByRole("button", { name: "org = payments" })).toBeInTheDocument();
    expect(within(bar).getByRole("button", { name: "+ filter" })).toBeInTheDocument();
    expect(bar).toHaveTextContent("23 of 318");
    await user.click(within(bar).getByRole("button", { name: "Clear" }));
    expect(onClear).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations(container);
  });

  test("without onClear or a count shows neither, and takes its own label", () => {
    render(
      <FilterBar label="Run filters">
        <FilterChip />
      </FilterBar>,
    );
    const bar = screen.getByRole("group", { name: "Run filters" });
    expect(within(bar).queryByRole("button", { name: "Clear" })).toBeNull();
    expect(bar.querySelector("[data-slot=filter-bar-count]")).toBeNull();
  });

  test("shows a count of zero", () => {
    render(<FilterBar count={0} />);
    expect(screen.getByRole("group")).toHaveTextContent("0");
  });
});

describe("InlineState", () => {
  test("loading is a status region with a default text", async () => {
    const { container, rerender } = render(
      <main>
        <InlineLoading />
      </main>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading…");
    rerender(
      <main>
        <InlineLoading>Loading runs…</InlineLoading>
      </main>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading runs…");
    await expectNoA11yViolations(container);
  });

  test("empty is a plain line, not a status region", () => {
    render(<InlineEmpty className="px-0">No runs in this range.</InlineEmpty>);
    const line = screen.getByText("No runs in this range.");
    expect(line.tagName).toBe("P");
    expect(line).toHaveClass("px-0");
    expect(line).not.toHaveClass("px-3.5");
    expect(screen.queryByRole("status")).toBeNull();
  });
});
