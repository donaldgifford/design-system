import { describe, expect, test } from "bun:test";
import {
  StackedBarsOverTime,
  stackTimeTable,
  stackTotal,
} from "@donaldgifford/design-system/blocks/stacked-bars-over-time";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";

const segments = [
  { key: "ok", label: "succeeded", color: "var(--success)" },
  { key: "bad", label: "failed", color: "var(--destructive)" },
];

const points = [
  { at: "2026-03-01T00:00:00Z", counts: { ok: 1200, bad: 3 } },
  { at: "2026-03-02T00:00:00Z", counts: {} },
  { at: "2026-03-03T00:00:00Z", counts: { ok: 7, other: 99 } },
];

describe("StackedBarsOverTime", () => {
  test("is one named image with a legend of its segments", async () => {
    const { container } = render(
      <main>
        <StackedBarsOverTime points={points} segments={segments} label="Runs by outcome" />
      </main>,
    );
    expect(screen.getByRole("img", { name: "Runs by outcome" })).toBeInTheDocument();
    expect(screen.getByText("succeeded")).toBeInTheDocument();
    expect(screen.getByText("failed")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("drops the legend when asked, and says so when there is nothing to plot", () => {
    const { rerender } = render(
      <StackedBarsOverTime points={points} segments={segments} label="Runs" legend={false} />,
    );
    expect(screen.queryByText("succeeded")).toBeNull();
    rerender(
      <StackedBarsOverTime points={[]} segments={segments} label="Runs" empty="No runs yet." />,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("No runs yet.")).toBeInTheDocument();
  });

  test("stackTotal counts only the named segments; a missing key is zero", () => {
    expect(points.map((p) => stackTotal(p, segments))).toEqual([1203, 0, 7]);
  });

  test("stackTimeTable is newest first with a total, and caps with a note", () => {
    expect(stackTimeTable(points, segments)).toEqual({
      head: ["Day", "succeeded", "failed", "Total"],
      numeric: [1, 2, 3],
      rows: [
        ["2026-03-03", "7", "0", "7"],
        ["2026-03-02", "0", "0", "0"],
        ["2026-03-01", "1,200", "3", "1,203"],
      ],
      note: undefined,
    });
    const capped = stackTimeTable(points, segments, { cap: 2, head: "Hour", noun: "hours" });
    expect(capped.head[0]).toBe("Hour");
    expect(capped.rows).toHaveLength(2);
    expect(capped.note).toBe("latest 2 of 3 hours");
  });
});
