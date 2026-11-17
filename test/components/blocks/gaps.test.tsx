import { describe, expect, mock, test } from "bun:test";
import { ChartCard } from "@donaldgifford/design-system/blocks/chart-card";
import { DataTable, dataTableColumns } from "@donaldgifford/design-system/blocks/data-table";
import { DetailsGrid } from "@donaldgifford/design-system/blocks/details-grid";
import { DistBar } from "@donaldgifford/design-system/blocks/dist-bar";
import { ErrorState } from "@donaldgifford/design-system/blocks/error-state";
import { ExportButton } from "@donaldgifford/design-system/blocks/export-button";
import { PageHeader } from "@donaldgifford/design-system/blocks/page-header";
import { StatStrip } from "@donaldgifford/design-system/blocks/stat-strip";
import { trendTable } from "@donaldgifford/design-system/blocks/trend-chart";
import { Card, CardTitle } from "@donaldgifford/design-system/components/card";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@donaldgifford/design-system/components/command";
import { ApiError } from "@donaldgifford/design-system/lib/errors";
import { listSearchDefaults } from "@donaldgifford/design-system/lib/list-search";
import { problemRequestId } from "@donaldgifford/design-system/lib/problem";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

interface Repo {
  id: string;
  name: string;
  open: number;
}

const repos: Repo[] = [
  { id: "r1", name: "payments/api", open: 4 },
  { id: "r2", name: "auth/gateway", open: 11 },
  { id: "r3", name: "web/console", open: 0 },
];

const helper = dataTableColumns<Repo>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Repository",
    meta: { className: "w-64" },
    cell: ({ getValue }) => <a href={`/repos/${getValue()}`}>{getValue()}</a>,
  }),
  helper.accessor("open", { header: "Open", meta: { numeric: true } }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: () => <button type="button">Waive</button>,
  }),
]);

const names = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.querySelector("td")?.textContent ?? "");

describe("DataTable without a search", () => {
  test("is a plain table: every row, its own sort, no filter or pager", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <DataTable columns={columns} data={repos} label="Repositories" filterPlaceholder="Filter" />
      </main>,
    );
    expect(screen.getByRole("table", { name: "Repositories" })).toBeInTheDocument();
    expect(names()).toEqual(["payments/api", "auth/gateway", "web/console"]);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: /page/i })).toBeNull();
    await user.click(screen.getByRole("button", { name: /Repository/ }));
    expect(names()).toEqual(["auth/gateway", "payments/api", "web/console"]);
    await expectNoA11yViolations(container);
  });

  test("manual without a total shows the rows as given and drops the pager", () => {
    render(
      <DataTable
        columns={columns}
        data={repos}
        manual
        search={{ ...listSearchDefaults, size: 2, sort: "name" }}
        onSearchChange={() => {}}
      />,
    );
    // Neither sorted nor cut to the page size: the server did both.
    expect(names()).toEqual(["payments/api", "auth/gateway", "web/console"]);
    expect(screen.queryByRole("button", { name: /page/i })).toBeNull();
  });

  test("manual with nothing listening offers no sort", async () => {
    const user = userEvent.setup();
    const onSearchChange = mock(() => {});
    const { rerender } = render(<DataTable columns={columns} data={repos} manual />);
    expect(screen.queryByRole("button", { name: /Repository/ })).toBeNull();
    expect(screen.getByRole("columnheader", { name: "Repository" })).not.toHaveAttribute(
      "aria-sort",
    );
    // With a listener the header asks, and the page answers with new rows.
    rerender(<DataTable columns={columns} data={repos} manual onSearchChange={onSearchChange} />);
    await user.click(screen.getByRole("button", { name: /Repository/ }));
    expect(onSearchChange).toHaveBeenCalledWith({ sort: "name" });
    expect(names()).toEqual(["payments/api", "auth/gateway", "web/console"]);
  });

  test("sortable={false} makes every header plain text, in any mode", () => {
    const { rerender } = render(<DataTable columns={columns} data={repos} sortable={false} />);
    const plain = () => {
      expect(screen.queryByRole("button", { name: /Repository|Open/ })).toBeNull();
      for (const header of screen.getAllByRole("columnheader")) {
        expect(header).not.toHaveAttribute("aria-sort");
      }
    };
    plain();
    rerender(
      <DataTable
        columns={columns}
        data={repos}
        sortable={false}
        search={listSearchDefaults}
        onSearchChange={() => {}}
      />,
    );
    plain();
  });

  test("sortable cannot force a sort nothing would perform", () => {
    render(<DataTable columns={columns} data={repos} manual sortable />);
    expect(screen.queryByRole("button", { name: /Repository/ })).toBeNull();
  });

  test("meta.className lands on the column's header and cells", () => {
    render(<DataTable columns={columns} data={repos} />);
    expect(screen.getByRole("columnheader", { name: /Repository/ })).toHaveClass("w-64");
    expect(screen.getAllByRole("row")[1]?.querySelector("td")).toHaveClass("w-64");
  });

  test("bare drops the border and the scroll cap", () => {
    const { container, rerender } = render(<DataTable columns={columns} data={repos} />);
    const frame = () => container.querySelector("[data-slot=table-container]")?.parentElement;
    expect(frame()).toHaveClass("border");
    rerender(<DataTable columns={columns} data={repos} bare />);
    expect(frame()).not.toHaveClass("border");
    expect(container.querySelector("[data-slot=table-container]")).not.toHaveClass(
      "overflow-y-auto",
    );
  });
});

describe("DataTable row activation", () => {
  test("a link or a button in the row keeps its own click and keys", async () => {
    const user = userEvent.setup();
    const onRowClick = mock((_row: Repo) => {});
    const onWaive = mock(() => {});
    const withAction = helper.columns([
      helper.accessor("name", { header: "Repository" }),
      helper.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <button type="button" onClick={onWaive}>
            Waive
          </button>
        ),
      }),
    ]);
    render(<DataTable columns={withAction} data={repos} onRowClick={onRowClick} />);
    const button = screen.getAllByRole("button", { name: "Waive" })[0] as HTMLElement;
    await user.click(button);
    expect(onWaive).toHaveBeenCalledTimes(1);
    button.focus();
    await user.keyboard("{Enter}");
    expect(onRowClick).not.toHaveBeenCalled();
    await user.click(screen.getByText("payments/api"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  test("Enter and Space on the row activate it", async () => {
    const user = userEvent.setup();
    const onRowClick = mock((_row: Repo) => {});
    render(<DataTable columns={columns} data={repos} onRowClick={onRowClick} />);
    (screen.getAllByRole("row")[2] as HTMLElement).focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onRowClick.mock.calls.map(([row]) => row.id)).toEqual(["r2", "r2"]);
  });
});

describe("DetailsGrid", () => {
  test("the list layout is one pair per row with values that wrap", async () => {
    const { container } = render(
      <main>
        <DetailsGrid
          layout="list"
          items={[
            { label: "Owner", value: "platform" },
            { label: "Rule", value: "A long description of the rule that wraps" },
          ]}
        />
      </main>,
    );
    const list = container.querySelector("[data-slot=details-grid]");
    expect(list).toHaveAttribute("data-layout", "list");
    expect(screen.getByText("platform").tagName).toBe("DD");
    expect(screen.getByText(/A long description/)).toHaveClass("break-words");
    await expectNoA11yViolations(container);
  });
});

describe("Card", () => {
  test("renders as another element, keeping its slot and classes", () => {
    render(
      <Card render={<section aria-label="Coverage" />} className="p-4">
        <CardTitle render={(props) => <h2 {...props} />}>Coverage</CardTitle>
      </Card>,
    );
    const card = screen.getByRole("region", { name: "Coverage" });
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveClass("rounded-lg", "p-4");
    const title = screen.getByRole("heading", { level: 2, name: "Coverage" });
    expect(title).toHaveAttribute("data-slot", "card-title");
  });

  test("is a div by default", () => {
    render(<Card data-testid="card">x</Card>);
    expect(screen.getByTestId("card").tagName).toBe("DIV");
  });
});

describe("ChartCard", () => {
  const points = [
    { at: "2026-03-01", value: 91.5 },
    { at: "2026-03-02", value: 97.3 },
  ];

  test("titles itself with a heading and keeps its strip in the table view", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <ChartCard
          title="Passing"
          headingLevel={2}
          strip={<StatStrip items={[{ label: "Now", value: "97.3%" }]} />}
          table={trendTable(points, "Passing")}
        >
          <p>plot</p>
        </ChartCard>
      </main>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Passing" })).toBeInTheDocument();
    expect(screen.getByText("Now")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.queryByText("plot")).toBeNull();
    expect(screen.getByText("Now")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("the title is an h3 unless told otherwise", () => {
    render(
      <ChartCard title="Passing" table={trendTable(points, "Passing")}>
        <p>plot</p>
      </ChartCard>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Passing" })).toBeInTheDocument();
  });

  test("trendTable names its first column and what it counts", () => {
    const table = trendTable(points, "Passing", { cap: 1, head: "Week", noun: "weeks" });
    expect(table.head).toEqual(["Week", "Passing"]);
    expect(table.note).toBe("latest 1 of 2 weeks");
  });
});

describe("DistBar", () => {
  const segments = [
    { label: "passing", value: 1200, color: "var(--success)" },
    { label: "failing", value: 300, color: "var(--destructive)" },
    { label: "waived", value: 0, color: "var(--muted-foreground)" },
  ];

  test("names itself, skips an empty segment, and titles the rest", async () => {
    const { container } = render(
      <main>
        <DistBar segments={segments} label="Repositories by status" />
      </main>,
    );
    const bar = screen.getByRole("img");
    expect(bar).toHaveAttribute(
      "aria-label",
      "Repositories by status: passing 1200 (80%), failing 300 (20%), waived 0 (0%)",
    );
    expect(bar.children).toHaveLength(2);
    expect(bar.children[0]).toHaveAttribute("title", "passing 1,200 (80%)");
    // The legend still lists the empty one, with grouped digits.
    const legend = within(container.querySelector("ul") as HTMLElement);
    expect(legend.getByText("1,200")).toBeInTheDocument();
    expect(legend.getByText("waived")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("the small size is a thin bar, and the legend can go", () => {
    const { container } = render(<DistBar segments={segments} size="sm" legend={false} />);
    expect(screen.getByRole("img")).toHaveAttribute("data-size", "sm");
    expect(screen.getByRole("img")).toHaveClass("h-2.5");
    expect(container.querySelector("ul")).toBeNull();
  });

  test("draws nothing, and does not divide by zero, when every segment is empty", () => {
    render(<DistBar segments={segments.map((s) => ({ ...s, value: 0 }))} />);
    expect(screen.getByRole("img").children).toHaveLength(0);
  });
});

describe("StatStrip", () => {
  test("a stat can carry a line under its value", () => {
    const { container } = render(
      <StatStrip
        items={[
          { label: "Repositories", value: "1,204", sub: "38 added this week" },
          { label: "Passing", value: "91%" },
        ]}
      />,
    );
    expect(screen.getByText("38 added this week")).toHaveAttribute("data-slot", "stat-sub");
    expect(container.querySelectorAll("[data-slot=stat-sub]")).toHaveLength(1);
  });
});

describe("problem errors", () => {
  const problem = (body: Record<string, unknown>) =>
    new Response(JSON.stringify({ type: "about:blank", ...body }), {
      status: 404,
      headers: { "content-type": "application/problem+json" },
    });

  test("the request id is read under either spelling", async () => {
    const snake = await ApiError.from(problem({ status: 404, request_id: "req-snake" }));
    expect(snake.requestId).toBe("req-snake");
    const camel = await ApiError.from(problem({ status: 404, requestId: "req-camel" }));
    expect(camel.requestId).toBe("req-camel");
    expect(problemRequestId({ type: "about:blank", title: "", status: 404 })).toBeUndefined();
  });

  test("ErrorState heads a problem with its status and title", async () => {
    const error = await ApiError.from(
      problem({ status: 404, title: "Not Found", detail: "no such repository", request_id: "r9" }),
    );
    const { rerender } = render(<ErrorState error={error} />);
    expect(screen.getByRole("heading", { name: "404 · Not Found" })).toBeInTheDocument();
    expect(screen.getByText("no such repository")).toBeInTheDocument();
    expect(screen.getByText("request r9")).toBeInTheDocument();
    rerender(<ErrorState error={error} title="Could not load the repository" />);
    expect(screen.getByRole("heading", { name: "Could not load the repository" })).toBeVisible();
  });

  test("ErrorState falls back to the reason, then to a generic heading", async () => {
    // A problem with no title, as a terse API sends it.
    const error = await ApiError.from(problem({ status: 403, reason: "NOT_ENTITLED" }));
    const { rerender } = render(<ErrorState error={error} />);
    expect(screen.getByRole("heading", { name: "NOT_ENTITLED" })).toBeInTheDocument();
    rerender(<ErrorState error={new Error("offline")} />);
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
  });
});

describe("PageHeader", () => {
  test("its actions wrap rather than squeeze the title", () => {
    const { container } = render(
      <PageHeader title="Findings" actions={<button type="button">Export</button>} />,
    );
    const actions = container.querySelector("[data-slot=page-header-actions]");
    expect(actions).toHaveClass("flex-wrap");
    expect(actions).not.toHaveClass("shrink-0");
  });
});

describe("ExportButton", () => {
  test("filename names the file apart from the button", async () => {
    const user = userEvent.setup();
    const download = mock((_name: string, _text: string) => {});
    render(
      <ExportButton
        name="findings"
        filename="repo-guardian-findings"
        columns={{ head: ["Repository"], row: (row: Repo) => [row.name] }}
        rows={repos}
        download={download}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Export findings as CSV" }));
    const today = new Date().toISOString().slice(0, 10);
    expect(download.mock.calls[0]?.[0]).toBe(`repo-guardian-findings-${today}.csv`);
  });
});

describe("CommandDialog", () => {
  test("commandProps reach the inner Command", async () => {
    const user = userEvent.setup();
    render(
      <CommandDialog open commandProps={{ shouldFilter: false, className: "from-the-app" }}>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandItem>payments/api</CommandItem>
          <CommandItem>auth/gateway</CommandItem>
        </CommandList>
      </CommandDialog>,
    );
    expect(document.querySelector("[data-slot=command]")).toHaveClass("from-the-app");
    await user.type(screen.getByPlaceholderText("Search"), "zzz");
    // Unfiltered: the app (a server search) decides what is listed.
    expect(screen.getByText("payments/api")).toBeInTheDocument();
    expect(screen.getByText("auth/gateway")).toBeInTheDocument();
  });
});
