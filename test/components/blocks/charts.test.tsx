import { describe, expect, test } from "bun:test";
import { BarBuckets, bucketsTable } from "@donaldgifford/design-system/blocks/bar-buckets";
import { BarList, barListTable, foldBarList } from "@donaldgifford/design-system/blocks/bar-list";
import { ChartCard, ChartTip, SeriesLegend } from "@donaldgifford/design-system/blocks/chart-card";
import { PairBars, pairTable } from "@donaldgifford/design-system/blocks/pair-bars";
import { Sparkline } from "@donaldgifford/design-system/blocks/sparkline";
import {
  rowShares,
  StackedBars,
  type StackRow,
  stackTable,
} from "@donaldgifford/design-system/blocks/stacked-bars";
import { TrendChart, trendTable } from "@donaldgifford/design-system/blocks/trend-chart";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const items = [
  { label: "b", value: 5 },
  { label: "a", value: 20 },
  { label: "c", value: 5 },
  { label: "d", value: 1 },
];

describe("Sparkline", () => {
  test("draws one stroke and a dot on the newest point, hidden from assistive tech", () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelector("path")?.getAttribute("d")).toBe("M3.0 19.0 L42.0 11.0 L81.0 3.0");
    expect(svg?.querySelector("circle")).toHaveAttribute("cx", "81");
    expect(svg?.querySelector("path")).toHaveAttribute("stroke", "var(--chart-1)");
  });

  test("breaks the line at an unmeasured point", () => {
    const { container } = render(<Sparkline values={[1, null, 3, 4]} />);
    const d = container.querySelector("path")?.getAttribute("d") ?? "";
    expect(d.match(/M/g)).toHaveLength(2);
  });

  test("draws a flat series mid-height, and a dash for fewer than two points", () => {
    const flat = render(<Sparkline values={[7, 7]} height={20} />);
    expect(flat.container.querySelector("path")?.getAttribute("d")).toBe("M3.0 10.0 L81.0 10.0");
    flat.unmount();
    const { container } = render(<Sparkline values={[null, 3]} />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container).toHaveTextContent("—");
  });
});

describe("BarList", () => {
  test("foldBarList sorts descending, ties by label, and folds the tail into other", () => {
    expect(foldBarList(items).map((i) => i.label)).toEqual(["a", "b", "c", "d"]);
    expect(foldBarList(items, 2)).toEqual([
      { label: "a", value: 20 },
      { label: "b", value: 5 },
      { label: "other", value: 6, sub: "2 more" },
    ]);
  });

  test("renders a named list with counts, shares, and bars scaled to the largest", async () => {
    const { container } = render(
      <main>
        <BarList items={items} label="Findings by rule" />
      </main>,
    );
    const list = screen.getByRole("list", { name: "Findings by rule" });
    const rows = within(list).getAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual([
      "a20 · 65%",
      "b5 · 16%",
      "c5 · 16%",
      "d1 · 3%",
    ]);
    const bars = [...list.querySelectorAll<HTMLElement>("[style]")].map((b) => b.style.width);
    expect(bars).toEqual(["100%", "25%", "25%", "5%"]);
    await expectNoA11yViolations(container);
  });

  test("renders a label through render, drops shares on request, and builds its table", () => {
    render(
      <BarList
        items={[{ label: "a", value: 2, sub: "kind", render: (l) => <a href="#a">{l}!</a> }]}
        share={false}
        label="x"
      />,
    );
    expect(screen.getByRole("link", { name: "a!" })).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent("a!kind2");
    expect(barListTable(items, "Rule", 2)).toEqual({
      head: ["Rule", "Count", "Share"],
      numeric: [1, 2],
      rows: [
        ["a", "20", "65%"],
        ["b", "5", "16%"],
        ["other", "6", "19%"],
      ],
    });
  });
});

const segments = [
  { key: "ok", label: "passing", color: "var(--success)" },
  { key: "bad", label: "failing", color: "var(--destructive)" },
];
const stack: StackRow[] = [
  { label: "codeowners", counts: { ok: 30, bad: 10 } },
  { label: "license", counts: { ok: 20 } },
];

describe("StackedBars", () => {
  test("rowShares divides by the row's own total", () => {
    expect(rowShares({ label: "x", counts: { ok: 1, bad: 2 } }, segments)).toEqual({
      total: 3,
      shares: [
        { key: "ok", value: 1, percent: 33.3 },
        { key: "bad", value: 2, percent: 66.7 },
      ],
    });
    expect(rowShares({ label: "x", counts: {} }, segments).shares[0]?.percent).toBe(0);
  });

  test("scales rows to the largest total, skips empty segments, and names the data", async () => {
    const { container } = render(
      <main>
        <StackedBars rows={stack} segments={segments} label="Results by rule" />
      </main>,
    );
    const list = screen.getByRole("list", {
      name: "Results by rule. codeowners: passing 30, failing 10; license: passing 20, failing 0",
    });
    const rows = within(list).getAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual(["codeowners40", "license20"]);
    expect(rows[1]?.querySelectorAll("[data-segment]")).toHaveLength(1);
    expect(rows[0]?.querySelector("[data-segment=bad]")).toHaveAttribute(
      "title",
      "failing 10 (25%)",
    );
    const legend = container.querySelector("[data-slot=series-legend]");
    expect(legend).toHaveTextContent("passingfailing");
    await expectNoA11yViolations(container);
  });

  test("a single row drops its label, and legend can be turned off", () => {
    const { container } = render(
      <StackedBars rows={stack.slice(0, 1)} segments={segments} legend={false} label="x" />,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent(/^40$/);
    expect(container.querySelector("[data-slot=series-legend]")).toBeNull();
    expect(stackTable(stack.slice(0, 1), segments)).toEqual({
      head: ["passing", "failing"],
      numeric: [0, 1],
      rows: [["30", "10"]],
    });
    expect(stackTable(stack, segments, "Rule")).toEqual({
      head: ["Rule", "passing", "failing"],
      numeric: [1, 2],
      rows: [
        ["codeowners", "30", "10"],
        ["license", "20", "0"],
      ],
    });
  });
});

const buckets = [
  { label: "<1d", value: 4 },
  { label: "1-7d", value: 1200 },
];
const days = [
  { day: "2026-03-01", a: 3, b: 1 },
  { day: "2026-03-02", a: 5, b: 4 },
];
const points = [
  { at: "2026-03-01T00:00:00Z", value: 91.5 },
  { at: "2026-03-02T00:00:00Z", value: null },
  { at: "2026-03-03T00:00:00Z", value: 97.25 },
];

describe("the Recharts blocks", () => {
  test("BarBuckets is one named image and builds its table", async () => {
    const { container } = render(
      <main>
        <BarBuckets buckets={buckets} label="Open findings by age" />
      </main>,
    );
    expect(screen.getByRole("img", { name: "Open findings by age" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
    expect(bucketsTable(buckets, "Open")).toEqual({
      head: ["Bucket", "Open"],
      numeric: [1],
      rows: [
        ["<1d", "4"],
        ["1-7d", "1,200"],
      ],
    });
  });

  test("PairBars names the pair in a legend and builds its table", async () => {
    const { container } = render(
      <main>
        <PairBars days={days} series={["opened", "closed"]} label="Opened and closed" />
      </main>,
    );
    expect(screen.getByRole("img", { name: "Opened and closed" })).toBeInTheDocument();
    expect(container.querySelector("[data-slot=series-legend]")).toHaveTextContent("openedclosed");
    await expectNoA11yViolations(container);
    expect(pairTable(days, ["opened", "closed"])).toEqual({
      head: ["Day", "opened", "closed"],
      numeric: [1, 2],
      rows: [
        ["2026-03-01", "3", "1"],
        ["2026-03-02", "5", "4"],
      ],
    });
  });

  test("TrendChart is one named image, and says so when there is nothing to plot", async () => {
    const { container, rerender } = render(
      <main>
        <TrendChart points={points} series="passing" label="Passing checks" />
      </main>,
    );
    expect(screen.getByRole("img", { name: "Passing checks" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
    rerender(
      <main>
        <TrendChart points={[]} series="passing" label="Passing checks" empty="No scans yet." />
      </main>,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("No scans yet.")).toBeInTheDocument();
  });

  test("trendTable is newest first, shows gaps as a dash, and caps with a note", () => {
    expect(trendTable(points, "Passing")).toEqual({
      head: ["Sampled", "Passing"],
      numeric: [1],
      rows: [
        ["2026-03-03", "97.3%"],
        ["2026-03-02", "—"],
        ["2026-03-01", "91.5%"],
      ],
      note: undefined,
    });
    const capped = trendTable(points, "Tracked", "count", 2);
    expect(capped.rows).toHaveLength(2);
    expect(capped.note).toBe("latest 2 of 3 points");
  });
});

describe("ChartCard", () => {
  test("swaps the plot and its legend for the same data as a table", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <ChartCard
          title="Findings by rule"
          description="Open, all orgs"
          action={<a href="#all">All</a>}
          table={barListTable(items, "Rule")}
          legend={<SeriesLegend items={[{ label: "open", color: "var(--chart-1)" }]} />}
        >
          <BarList items={items} label="Findings by rule" />
        </ChartCard>
      </main>,
    );
    const toggle = screen.getByRole("button", { name: "Table" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Open, all orgs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Findings by rule" })).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
    await expectNoA11yViolations(container);

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("list")).toBeNull();
    const table = screen.getByRole("table");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((h) => h.textContent),
    ).toEqual(["Rule", "Count", "Share"]);
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("a2065%");
    expect(within(table).getAllByRole("cell")[1]).toHaveClass("text-right", "tabular-nums");
    await expectNoA11yViolations(container);

    await user.click(toggle);
    expect(screen.getByRole("list", { name: "Findings by rule" })).toBeInTheDocument();
  });

  test("shows the table's note under it", async () => {
    const user = userEvent.setup();
    render(
      <ChartCard title="Trend" table={trendTable(points, "Passing", "%", 1)}>
        <p>plot</p>
      </ChartCard>,
    );
    await user.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.getByText("latest 1 of 3 points")).toBeInTheDocument();
  });
});

describe("ChartTip", () => {
  test("lists a heading and a row per series, with a swatch where there is a color", () => {
    const { container } = render(
      <ChartTip
        heading="Mar 14"
        rows={[
          { label: "opened", value: "12", color: "var(--chart-1)" },
          { label: "closed", value: "9" },
        ]}
      />,
    );
    expect(container).toHaveTextContent("Mar 14opened12closed9");
    expect(container.querySelectorAll("[aria-hidden=true]")).toHaveLength(1);
    expect(container.firstElementChild).toHaveClass("shadow-tooltip", "bg-popover");
  });
});
