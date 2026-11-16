import { describe, expect, mock, test } from "bun:test";
import { ExportButton } from "@donaldgifford/design-system/blocks/export-button";
import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import {
  GridChildRows,
  type GridColumn,
  type GridRow,
  GroupGrid,
  heatStyle,
} from "@donaldgifford/design-system/blocks/group-grid";
import { LoadMore } from "@donaldgifford/design-system/blocks/load-more";
import { Meter, meterTone } from "@donaldgifford/design-system/blocks/meter";
import { SeriesPills } from "@donaldgifford/design-system/blocks/series-pills";
import { Time, TimeZoneProvider, TimeZoneToggle } from "@donaldgifford/design-system/blocks/time";
import { formatTime } from "@donaldgifford/design-system/lib/time";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

describe("FilterChip", () => {
  test("is a button reading key = value", async () => {
    const user = userEvent.setup();
    const onClick = mock(() => {});
    const { container } = render(
      <main>
        <FilterChip name="org" value="payments" onClick={onClick} />
      </main>,
    );
    const chip = screen.getByRole("button", { name: "org = payments" });
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).not.toHaveClass("border-dashed");
    await user.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations(container);
  });

  test("with no name is the dashed chip that adds a filter", () => {
    const { rerender } = render(<FilterChip />);
    expect(screen.getByRole("button", { name: "+ filter" })).toHaveClass("border-dashed");
    rerender(<FilterChip disabled>Add rule</FilterChip>);
    expect(screen.getByRole("button", { name: "Add rule" })).toBeDisabled();
  });
});

describe("Meter", () => {
  test("meterTone follows the thresholds, and is muted when unmeasured", () => {
    expect(meterTone(69.9)).toBe("destructive");
    expect(meterTone(70)).toBe("warning");
    expect(meterTone(89.9)).toBe("warning");
    expect(meterTone(90)).toBe("success");
    expect(meterTone(null)).toBe("muted");
    expect(meterTone(undefined)).toBe("muted");
    expect(meterTone(40, { low: 25, high: 50 })).toBe("warning");
  });

  test.each([
    [98.44, "success", "98.4%", "98.44%"],
    [84, "warning", "84.0%", "84%"],
    [12, "destructive", "12.0%", "12%"],
    [140, "success", "140.0%", "100%"],
    [null, "muted", "no data", "0%"],
  ] as const)("renders %p as %s", async (percent, tone, text, width) => {
    const { container } = render(
      <main>
        <Meter percent={percent} label="Passing checks" />
      </main>,
    );
    const meter = screen.getByRole("meter", { name: "Passing checks" });
    expect(meter).toHaveAttribute("data-tone", tone);
    expect(meter).toHaveAttribute("aria-valuetext", text);
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(meter.querySelector<HTMLElement>("[data-slot=meter-bar]")?.style.width).toBe(width);
    expect(screen.getByText(text)).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("takes a fixed tone, custom thresholds, a size, and can hide the figure", () => {
    const { rerender } = render(<Meter percent={99} tone="warning" label="x" showValue={false} />);
    const meter = () => screen.getByRole("meter");
    expect(meter()).toHaveAttribute("data-tone", "warning");
    expect(meter()).toHaveClass("h-1.5", "bg-warning/20");
    expect(screen.queryByText("99.0%")).toBeNull();
    rerender(<Meter percent={30} thresholds={{ low: 10, high: 20 }} size="md" label="x" />);
    expect(meter()).toHaveAttribute("data-tone", "success");
    expect(meter()).toHaveClass("h-2.5");
  });
});

const columns: GridColumn[] = [
  { key: "repos", header: "Repos" },
  { key: "passing", header: "Passing", tone: "success" },
  { key: "failing", header: "Failing", tone: "destructive" },
  { key: "owner", header: "Owner", align: "left" },
];
const gridRows: GridRow[] = [
  {
    key: "payments",
    label: <a href="#payments">payments</a>,
    sub: "3 teams",
    cells: {
      repos: 1340,
      passing: { n: 30, of: 40 },
      failing: { n: 10, of: 40 },
      owner: "kim",
    },
  },
  {
    key: "sandbox",
    label: "sandbox",
    name: "the sandbox org",
    cells: { repos: { n: 7 }, passing: { n: 0, of: 0 }, failing: { n: 0, of: null }, owner: "—" },
  },
];
const kids: GridRow[] = [
  { key: "payments/api", label: "payments/api", cells: { repos: 1, failing: { n: 2, of: 8 } } },
];

function Grid({ loading = false, empty = false }: { loading?: boolean; empty?: boolean }) {
  const [open, setOpen] = useState<readonly string[]>([]);
  return (
    <main>
      <GroupGrid
        heading="Org / repository"
        label="Checks by org"
        columns={columns}
        rows={gridRows}
        heat={["failing"]}
        open={open}
        onToggle={(key) =>
          setOpen((now) => (now.includes(key) ? now.filter((k) => k !== key) : [...now, key]))
        }
        footer={{ label: "All", cells: { repos: 1347, failing: { n: 10, of: 40 } } }}
      >
        {(row) => (
          <GridChildRows
            parent={row.key}
            rows={empty ? [] : kids}
            loading={loading}
            empty="No repositories."
            footer="showing 1 of 134"
          />
        )}
      </GroupGrid>
    </main>
  );
}

describe("GroupGrid", () => {
  test("heatStyle tints by share in the column's tone, and not at all for zero", () => {
    expect(heatStyle(0, 10, "success")).toBeUndefined();
    expect(heatStyle(10, 10, "destructive")).toEqual({
      background: "color-mix(in srgb, var(--destructive) 50%, transparent)",
    });
    expect(heatStyle(1, 1000, "muted")).toEqual({
      background: "color-mix(in srgb, var(--muted-foreground) 8%, transparent)",
    });
  });

  test("renders counts, shares, heat, no data, and a footer without heat", async () => {
    const { container } = render(<Grid />);
    const table = screen.getByRole("table", { name: "Checks by org" });
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((h) => h.textContent),
    ).toEqual(["Org / repository", "Repos", "Passing", "Failing", "Owner"]);
    const payments = within(table).getAllByRole("row")[1] as HTMLElement;
    const cells = within(payments).getAllByRole("cell");
    expect(cells.map((c) => c.textContent)).toEqual([
      "payments3 teams",
      "1,340",
      "3075%",
      "1025%",
      "kim",
    ]);
    // Only the column in `heat` is shaded.
    expect(cells[2]).not.toHaveAttribute("data-heat");
    expect(cells[3]).toHaveAttribute("data-heat", "failing");
    expect(cells[3]).toHaveAttribute("data-shade", "19");
    expect(cells[4]).not.toHaveClass("text-right");

    const sandbox = within(table).getAllByRole("row")[2] as HTMLElement;
    expect(
      within(sandbox)
        .getAllByRole("cell")
        .map((c) => c.textContent),
    ).toEqual(["sandbox", "7", "no data", "no data", "—"]);
    const footer = container.querySelector("[data-row=footer]") as HTMLElement;
    expect(footer).toHaveTextContent("All1,3471025%");
    expect(footer.querySelector("[data-heat]")).toBeNull();
    await expectNoA11yViolations(container);
  });

  test("expands a row in place from its chevron, and collapses it again", async () => {
    const user = userEvent.setup();
    const { container } = render(<Grid />);
    const expand = screen.getByRole("button", { name: "Expand payments" });
    expect(expand).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Expand the sandbox org" })).toBeInTheDocument();
    // The label's link is beside the toggle, not inside it.
    expect(expand.querySelector("a")).toBeNull();
    expect(container.querySelectorAll("[data-children]")).toHaveLength(0);

    expand.focus();
    await user.keyboard("{Enter}");
    const collapse = screen.getByRole("button", { name: "Collapse payments" });
    expect(collapse).toHaveAttribute("aria-expanded", "true");
    const child = container.querySelector("[data-child='payments/api']") as HTMLElement;
    expect(
      within(child)
        .getAllByRole("cell")
        .map((c) => c.textContent),
    ).toEqual(["payments/api", "1", "", "225%", ""]);
    expect(within(child).getAllByRole("cell")[3]).toHaveAttribute("data-heat", "failing");
    expect(screen.getByText("showing 1 of 134").closest("td")).toHaveAttribute("colspan", "5");
    // The child rows sit directly under their parent, before the next group.
    const order = [...container.querySelectorAll("tbody tr")].map(
      (tr) => tr.getAttribute("data-row") ?? tr.getAttribute("data-children"),
    );
    expect(order).toEqual(["payments", "payments", "payments", "sandbox", "footer"]);
    await expectNoA11yViolations(container);

    await user.click(collapse);
    expect(container.querySelectorAll("[data-children]")).toHaveLength(0);
  });

  test("says when a group is loading or has no children", async () => {
    const user = userEvent.setup();
    const loading = render(<Grid loading />);
    await user.click(screen.getByRole("button", { name: "Expand payments" }));
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    loading.unmount();
    render(<Grid empty />);
    await user.click(screen.getByRole("button", { name: "Expand payments" }));
    expect(screen.getByText("No repositories.")).toBeInTheDocument();
    expect(screen.queryByText("showing 1 of 134")).toBeNull();
  });
});

describe("LoadMore", () => {
  test("counts what is loaded and asks for the next page", async () => {
    const user = userEvent.setup();
    const onMore = mock(() => {});
    const { container, rerender } = render(
      <main>
        <LoadMore loaded={50} total={1342} hasMore onMore={onMore} noun="findings" />
      </main>,
    );
    expect(screen.getByText("50 loaded of 1,342 findings")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Load more" }));
    expect(onMore).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations(container);

    rerender(
      <main>
        <LoadMore loaded={50} hasMore loading onMore={onMore} />
      </main>,
    );
    expect(screen.getByText("50 loaded rows")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Loading…" })).toBeDisabled();
  });

  test("drops the button on the last page, and itself when there is nothing", () => {
    const { container, rerender } = render(
      <LoadMore loaded={3} hasMore={false} onMore={() => {}} />,
    );
    expect(screen.getByText("3 loaded rows")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<LoadMore loaded={0} hasMore={false} onMore={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});

interface Finding {
  repo: string;
  status: string;
}
const findings: Finding[] = [
  { repo: "payments/api", status: "failing" },
  { repo: "=cmd", status: "waived" },
];
const csvColumns = { head: ["Repository", "Status"], row: (f: Finding) => [f.repo, f.status] };
const today = new Date().toISOString().slice(0, 10);

describe("ExportButton", () => {
  test("saves the loaded rows under a name built from the filters", async () => {
    const user = userEvent.setup();
    const download = mock((_name: string, _text: string) => {});
    const { container } = render(
      <main>
        <ExportButton
          name="findings"
          filter={{ status: "failing", org: undefined }}
          columns={csvColumns}
          rows={findings}
          download={download}
        />
      </main>,
    );
    await user.click(screen.getByRole("button", { name: "Export findings as CSV" }));
    expect(download).toHaveBeenCalledWith(
      `findings-status-failing-${today}.csv`,
      "Repository,Status\r\npayments/api,failing\r\n'=cmd,waived\r\n",
    );
    await expectNoA11yViolations(container);
  });

  test("is disabled while the rows load and when there are none", () => {
    const { rerender } = render(
      <ExportButton name="findings" columns={csvColumns} rows={undefined} />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    rerender(<ExportButton name="findings" columns={csvColumns} rows={[]} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("with all, fetches the whole set and says when the cap cut it short", async () => {
    const user = userEvent.setup();
    const download = mock((_name: string, _text: string) => {});
    const whole = [...findings, { repo: "data/etl", status: "failing" }];
    render(
      <ExportButton
        name="findings"
        columns={csvColumns}
        rows={findings.slice(0, 1)}
        all={{ cap: 10000, fetch: async () => ({ rows: whole, truncated: true }) }}
        download={download}
      />,
    );
    await user.click(screen.getByRole("button"));
    await waitFor(() => expect(download).toHaveBeenCalledTimes(1));
    expect(download.mock.calls[0]?.[1]?.trim().split("\r\n")).toHaveLength(4);
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Export cut short at 10,000 rows; narrow the filters for the rest.",
    );
    expect(screen.getByRole("button")).toBeEnabled();
  });

  test("reports a failed fetch and saves nothing", async () => {
    const user = userEvent.setup();
    const download = mock((_name: string, _text: string) => {});
    render(
      <ExportButton
        name="findings"
        columns={csvColumns}
        rows={findings}
        all={{
          cap: 10,
          fetch: async () => {
            throw new Error("503 from the API");
          },
        }}
        download={download}
      />,
    );
    await user.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("503 from the API"));
    expect(download).not.toHaveBeenCalled();
  });
});

const iso = "2026-03-04T09:05:00Z";

describe("Time", () => {
  test("renders local without a provider, with UTC in the title", async () => {
    const { container } = render(
      <main>
        <Time iso={iso} />
      </main>,
    );
    const time = container.querySelector("time") as HTMLElement;
    expect(time).toHaveAttribute("datetime", iso);
    expect(time).toHaveTextContent(formatTime(iso, { zone: "local" }));
    expect(time).toHaveAttribute("title", "2026-03-04 09:05 UTC");
    await expectNoA11yViolations(container);
  });

  test("renders a date, a relative time titled with the absolute one, and a dash", () => {
    const { container, rerender } = render(
      <TimeZoneProvider initial="utc">
        <Time iso={iso} style="date" />
      </TimeZoneProvider>,
    );
    expect(container.querySelector("time")).toHaveTextContent("2026-03-04");
    rerender(
      <TimeZoneProvider initial="utc">
        <Time iso={new Date(Date.now() - 2 * 86_400_000).toISOString()} style="relative" />
      </TimeZoneProvider>,
    );
    expect(container.querySelector("time")).toHaveTextContent("2 days ago");
    expect(container.querySelector("time")?.getAttribute("title")).toMatch(
      /^\d{4}-\d\d-\d\d \d\d:\d\d$/,
    );
    rerender(<Time iso={undefined} />);
    expect(container.querySelector("time")).toBeNull();
    expect(container).toHaveTextContent("—");
  });

  test("the toggle switches every time under the provider and stores the choice", async () => {
    const user = userEvent.setup();
    localStorage.removeItem("test.tz");
    const { container, unmount } = render(
      <main>
        <TimeZoneProvider storageKey="test.tz">
          <TimeZoneToggle />
          <Time iso={iso} />
        </TimeZoneProvider>
      </main>,
    );
    const group = screen.getByRole("group", { name: "Time zone" });
    const local = within(group).getByRole("button", { name: "Local" });
    const utc = within(group).getByRole("button", { name: "UTC" });
    expect(local).toHaveAttribute("aria-pressed", "true");
    expect(utc).toHaveAttribute("aria-pressed", "false");
    await expectNoA11yViolations(container);

    await user.click(utc);
    expect(utc).toHaveAttribute("aria-pressed", "true");
    expect(local).toHaveAttribute("aria-pressed", "false");
    const time = container.querySelector("time") as HTMLElement;
    expect(time).toHaveTextContent("2026-03-04 09:05");
    expect(time.getAttribute("title")).toBe(`${formatTime(iso, { zone: "local" })} local`);
    expect(localStorage.getItem("test.tz")).toBe("utc");

    // Pressing the pressed zone leaves it in force.
    await user.click(utc);
    expect(utc).toHaveAttribute("aria-pressed", "true");
    expect(time).toHaveTextContent("2026-03-04 09:05");

    // A new provider starts from the stored choice.
    unmount();
    const again = render(
      <TimeZoneProvider storageKey="test.tz">
        <Time iso={iso} />
      </TimeZoneProvider>,
    );
    expect(again.container.querySelector("time")).toHaveTextContent("2026-03-04 09:05");
    localStorage.removeItem("test.tz");
  });
});

const pills = [
  { key: "payments", label: "payments", color: "var(--chart-1)", value: "98.1%" },
  { key: "web", label: "web", color: "var(--chart-2)" },
  { key: "data", label: "data", color: "var(--chart-3)" },
];

function Pills({ initial = "payments" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <main>
      <SeriesPills items={pills} value={value} onValueChange={setValue} label="Org" />
    </main>
  );
}

describe("SeriesPills", () => {
  test("is a radio group with one pill checked and one tab stop", async () => {
    const user = userEvent.setup();
    const { container } = render(<Pills />);
    const group = screen.getByRole("radiogroup", { name: "Org" });
    const radios = within(group).getAllByRole("radio");
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
    expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1]);
    expect(radios[0]).toHaveAccessibleName("payments 98.1%");
    await expectNoA11yViolations(container);

    await user.click(screen.getByRole("radio", { name: "data" }));
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["false", "false", "true"]);
    expect(radios.map((r) => r.tabIndex)).toEqual([-1, -1, 0]);
  });

  test("the arrow keys move the selection and the focus, wrapping at the ends", async () => {
    const user = userEvent.setup();
    render(<Pills />);
    const radios = screen.getAllByRole("radio");
    await user.tab();
    expect(radios[0]).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(radios[1]).toHaveFocus();
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(radios[0]).toHaveFocus();
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowLeft}");
    expect(radios[2]).toHaveFocus();
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
  });

  test("stays reachable when the value names no series", () => {
    render(<Pills initial="gone" />);
    expect(screen.getAllByRole("radio").map((r) => r.tabIndex)).toEqual([0, -1, -1]);
  });
});
