import {
  DataTable,
  type DataTableProps,
  dataTableColumns,
} from "@donaldgifford/design-system/blocks/data-table";
import { EmptyState } from "@donaldgifford/design-system/blocks/empty-state";
import { Badge } from "@donaldgifford/design-system/components/badge";
import type { ListSearch } from "@donaldgifford/design-system/lib/list-params";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconServer } from "@tabler/icons-react";
import { useState } from "react";
import { fn } from "storybook/test";

interface Cluster {
  name: string;
  account: string;
  region: string;
  status: "ready" | "degraded" | "upgrading";
  nodes: number;
}

const clusters: Cluster[] = [
  {
    name: "payments-prod-usw2",
    account: "payments-prod",
    region: "us-west-2",
    status: "ready",
    nodes: 24,
  },
  {
    name: "payments-prod-use1",
    account: "payments-prod",
    region: "us-east-1",
    status: "ready",
    nodes: 18,
  },
  {
    name: "payments-dev-usw2",
    account: "payments-dev",
    region: "us-west-2",
    status: "upgrading",
    nodes: 6,
  },
  {
    name: "web-stage-usw2",
    account: "web-stage",
    region: "us-west-2",
    status: "degraded",
    nodes: 9,
  },
  { name: "web-prod-euw1", account: "web-prod", region: "eu-west-1", status: "ready", nodes: 31 },
  { name: "data-prod-usw2", account: "data-prod", region: "us-west-2", status: "ready", nodes: 12 },
  { name: "mgmt-hub", account: "shared", region: "us-west-2", status: "ready", nodes: 3 },
];

const statusVariant = {
  ready: "success",
  degraded: "destructive",
  upgrading: "info",
} as const;

const helper = dataTableColumns<Cluster>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Cluster",
    cell: ({ getValue }) => <code className="font-mono text-xs">{getValue()}</code>,
  }),
  helper.accessor("account", { header: "Account" }),
  helper.accessor("region", { header: "Region" }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <Badge variant={statusVariant[getValue()]}>{getValue()}</Badge>,
    enableSorting: false,
  }),
  helper.accessor("nodes", { header: "Nodes", meta: { numeric: true } }),
]);

/**
 * The table's search is the list page's URL state; here a local state
 * stands in for the router, and every patch is logged as an action.
 */
function StatefulTable(props: DataTableProps<Cluster>) {
  const [search, setSearch] = useState<ListSearch>(props.search ?? { page: 1, size: 10 });
  return (
    <DataTable
      {...props}
      search={search}
      onSearchChange={(patch) => {
        props.onSearchChange?.(patch);
        setSearch((current) => ({ ...current, ...patch }));
      }}
    />
  );
}

const meta = {
  title: "Blocks/DataTable",
  component: DataTable,
  args: {
    columns,
    data: clusters,
    search: { page: 1, size: 5 },
    onSearchChange: fn(),
    onRowClick: undefined,
    getRowId: (row) => row.name,
    filterPlaceholder: "Filter clusters",
    isLoading: false,
  },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    search: { control: "object" },
    empty: { control: false },
  },
  // Keyed on the search arg, so editing it in the controls restarts the state.
  render: (args) => <StatefulTable key={JSON.stringify(args.search)} {...args} />,
} satisfies Meta<typeof DataTable<Cluster>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click a header to sort; Status opts out. The pager splits seven clusters into pages of five. */
export const Default: Story = {};

/** Sorted by node count, descending, through the `sort` search param. */
export const Sorted: Story = { args: { search: { page: 1, size: 10, sort: "-nodes" } } };

/** Filtered through the `q` search param. */
export const Filtered: Story = { args: { search: { page: 1, size: 10, q: "payments" } } };

/** Rows are focusable and open on click or Enter. */
export const ClickableRows: Story = { args: { onRowClick: fn() } };

/** `selectedId` tints the row a detail panel is showing. */
export const SelectedRow: Story = { args: { onRowClick: fn(), selectedId: "payments-dev-usw2" } };

export const Loading: Story = { args: { isLoading: true, data: [] } };

export const Empty: Story = {
  args: {
    data: [],
    empty: (
      <EmptyState
        className="border-0 p-6"
        title="No clusters"
        description="Clusters this account owns appear here."
        icon={IconServer}
      />
    ),
  },
};

/** Without `empty` the table falls back to "No results.". */
export const EmptyDefault: Story = { args: { data: [], filterPlaceholder: undefined } };

/**
 * Server-paged: `total` says the server already filtered, sorted, and
 * paged, so the table shows `data` as is and pages against the total.
 */
export const ServerPaged: Story = {
  args: { data: clusters.slice(0, 5), total: 42, search: { page: 1, size: 5 } },
};

/**
 * Cursor-paged: `manual` without a `total`. The table shows the rows as
 * given and has no pager; the page puts a LoadMore under it.
 */
export const Manual: Story = {
  args: { manual: true, filterPlaceholder: undefined, label: "Clusters" },
};

/**
 * No `search`: a plain table that shows every row and keeps its own sort,
 * with no filter or pager. `bare` drops the border, for a table in a card.
 */
export const Plain: Story = {
  render: () => <DataTable columns={columns} data={clusters} label="Clusters" bare />,
};

/**
 * `sortable={false}`: plain headers, for a short table of reference data
 * inside a card.
 */
export const NotSortable: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={clusters.slice(0, 4)}
      label="Clusters"
      sortable={false}
      bare
    />
  ),
};

const responsiveColumns = helper.columns([
  helper.accessor("name", {
    header: "Cluster",
    cell: ({ getValue }) => <code className="font-mono text-xs">{getValue()}</code>,
  }),
  helper.accessor("account", { header: "Account", meta: { hideBelow: "compact" } }),
  helper.accessor("region", { header: "Region", meta: { hideBelow: "lg" } }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <Badge variant={statusVariant[getValue()]}>{getValue()}</Badge>,
    enableSorting: false,
  }),
  helper.accessor("nodes", { header: "Nodes", meta: { numeric: true, hideBelow: "md" } }),
]);

/**
 * `meta.hideBelow` drops a column under a viewport breakpoint: Nodes
 * below `md`, Region below `lg`. Narrow the window to see them go.
 */
export const ResponsiveColumns: Story = {
  render: (args) => (
    <StatefulTable key={JSON.stringify(args.search)} {...args} columns={responsiveColumns} />
  ),
};

/**
 * `compact` says the table shares its row, with a detail panel beside it
 * say, and drops the columns marked `hideBelow: "compact"` (Account here)
 * whatever the viewport.
 */
export const Compact: Story = { ...ResponsiveColumns, args: { compact: true } };
