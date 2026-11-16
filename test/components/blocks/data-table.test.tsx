import { describe, expect, test } from "bun:test";
import { DataTable, dataTableColumns } from "@donaldgifford/design-system/blocks/data-table";
import { type ListSearch, listSearchDefaults } from "@donaldgifford/design-system/lib/list-search";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

interface Sandbox {
  id: string;
  name: string;
  cpu: number;
}

const rows: Sandbox[] = Array.from({ length: 12 }, (_, i) => ({
  id: `sbx_${i + 1}`,
  name: `box-${String.fromCharCode(97 + ((i * 7) % 26))}${i}`,
  cpu: (i * 3) % 7,
}));

const helper = dataTableColumns<Sandbox>();
const columns = helper.columns([
  helper.accessor("name", { header: "Name" }),
  helper.accessor("cpu", { header: "vCPU", enableSorting: false }),
]);

function Harness({ initial, total }: { initial?: Partial<ListSearch>; total?: number }) {
  const [search, setSearch] = useState<ListSearch>({ ...listSearchDefaults, ...initial });
  const [clicked, setClicked] = useState("");
  const resets = (patch: Partial<ListSearch>) =>
    ("q" in patch || "sort" in patch || "size" in patch) && !("page" in patch);
  return (
    <main>
      <p data-testid="search">{JSON.stringify(search)}</p>
      <p data-testid="clicked">{clicked}</p>
      <DataTable
        columns={columns}
        data={rows}
        total={total}
        search={search}
        onSearchChange={(patch) =>
          setSearch((prev) => ({ ...prev, ...patch, ...(resets(patch) ? { page: 1 } : {}) }))
        }
        getRowId={(row) => row.id}
        onRowClick={(row) => setClicked(row.id)}
        filterPlaceholder="Filter sandboxes"
      />
    </main>
  );
}

const names = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.querySelector("td")?.textContent ?? "");

describe("DataTable", () => {
  test("pages, sorts, and filters from the search, and writes changes back", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness initial={{ size: 5 }} />);
    expect(names()).toHaveLength(5);
    expect(screen.getByTestId("row-count")).toHaveTextContent("12 rows");
    expect(screen.getByTestId("page-label")).toHaveTextContent("Page 1 of 3");

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByTestId("search")).toHaveTextContent('"page":2');
    expect(names()[0]).toBe(rows[5]?.name ?? "");

    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(screen.getByTestId("search")).toHaveTextContent('"sort":"name"');
    expect(screen.getByTestId("search")).toHaveTextContent('"page":1');
    const header = screen.getByRole("columnheader", { name: /Name/ });
    expect(header).toHaveAttribute("aria-sort", "ascending");
    const sorted = [...rows].sort((a, b) => a.name.localeCompare(b.name)).map((r) => r.name);
    expect(names()).toEqual(sorted.slice(0, 5));

    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(screen.getByTestId("search")).toHaveTextContent('"sort":"-name"');
    expect(header).toHaveAttribute("aria-sort", "descending");

    expect(screen.queryByRole("button", { name: "vCPU" })).toBeNull();

    await user.type(screen.getByRole("textbox", { name: "Filter" }), "box-a");
    expect(screen.getByTestId("search")).toHaveTextContent('"q":"box-a"');
    expect(names().every((n) => n.includes("box-a"))).toBe(true);
    await expectNoA11yViolations(container);
  });

  test("a row click reports the row", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText(rows[2]?.name ?? ""));
    expect(screen.getByTestId("clicked")).toHaveTextContent("sbx_3");
  });

  test("with a total the table trusts the server's page", () => {
    render(<Harness initial={{ page: 3, size: 5, sort: "-name", q: "zzz" }} total={57} />);
    expect(names()).toHaveLength(12);
    expect(screen.getByTestId("row-count")).toHaveTextContent("57 rows");
    expect(screen.getByTestId("page-label")).toHaveTextContent("Page 3 of 12");
  });

  test("renders the empty state when nothing matches", () => {
    render(<Harness initial={{ q: "no-such-box" }} />);
    expect(screen.getByText("No results.")).toBeInTheDocument();
    expect(screen.getByTestId("page-label")).toHaveTextContent("Page 0 of 0");
  });
});

describe("DataTable columns", () => {
  const responsive = helper.columns([
    helper.accessor("name", { header: "Name" }),
    helper.accessor("id", { header: "ID", meta: { hideBelow: "compact" } }),
    helper.accessor("cpu", { header: "vCPU", meta: { numeric: true, hideBelow: "lg" } }),
  ]);
  const table = (props: { compact?: boolean; isLoading?: boolean; data?: Sandbox[] }) => (
    <main>
      <DataTable
        columns={responsive}
        data={props.data ?? rows.slice(0, 2)}
        search={{ ...listSearchDefaults }}
        onSearchChange={() => {}}
        compact={props.compact}
        isLoading={props.isLoading}
      />
    </main>
  );

  test("hideBelow hides a column's header and cells under its breakpoint", async () => {
    const { container } = render(table({}));
    const headers = screen.getAllByRole("columnheader");
    expect(headers.map((h) => h.textContent)).toEqual(["Name", "ID", "vCPU"]);
    expect(headers[2]).toHaveClass("hidden", "lg:table-cell", "text-right");
    expect(headers[0]).not.toHaveClass("hidden");
    expect(headers[1]).not.toHaveClass("hidden");
    const cells = screen.getAllByRole("row")[1]?.querySelectorAll("td");
    expect(cells?.[2]).toHaveClass("hidden", "lg:table-cell", "tabular-nums");
    expect(cells?.[0]).not.toHaveClass("hidden");
    await expectNoA11yViolations(container);
  });

  test("selectedId marks one row selected", () => {
    render(
      <DataTable
        columns={responsive}
        data={rows.slice(0, 3)}
        search={{ ...listSearchDefaults }}
        onSearchChange={() => {}}
        getRowId={(row) => row.id}
        selectedId="sbx_2"
      />,
    );
    const body = screen.getAllByRole("row").slice(1);
    expect(body.map((row) => row.getAttribute("data-state"))).toEqual([null, "selected", null]);
    expect(body[1]).toHaveAttribute("aria-selected", "true");
    expect(body[0]).not.toHaveAttribute("aria-selected");
  });

  test("compact drops the columns marked for it, whatever the viewport", () => {
    const { rerender } = render(table({ compact: true }));
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Name", "vCPU"]);
    expect(screen.getAllByRole("row")[1]?.querySelectorAll("td")).toHaveLength(2);
    rerender(table({ compact: true, data: [] }));
    expect(screen.getByText("No results.").closest("td")).toHaveAttribute("colspan", "2");
    rerender(table({ compact: true, isLoading: true }));
    const placeholder = screen.getAllByRole("row")[1]?.querySelectorAll("td");
    expect(placeholder).toHaveLength(2);
    expect(placeholder?.[1]).toHaveClass("hidden", "lg:table-cell");
  });
});
