import {
  GridChildRows,
  type GridColumn,
  type GridRow,
  GroupGrid,
} from "@donaldgifford/design-system/blocks/group-grid";
import { Badge } from "@donaldgifford/design-system/components/badge";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const columns: GridColumn[] = [
  { key: "repos", header: "Repos" },
  { key: "passing", header: "Passing", tone: "success" },
  { key: "failing", header: "Failing", tone: "destructive" },
  { key: "waived", header: "Waived", tone: "warning" },
];

const posture = (repos: number, passing: number, failing: number, waived: number) => {
  const of = passing + failing + waived;
  return {
    repos,
    passing: { n: passing, of },
    failing: { n: failing, of },
    waived: { n: waived, of },
  };
};

const rows: GridRow[] = [
  { key: "payments", label: "payments", sub: "3 teams", cells: posture(134, 980, 61, 12) },
  {
    key: "web",
    label: "web",
    badge: <Badge variant="warning">at risk</Badge>,
    cells: posture(88, 412, 230, 40),
  },
  { key: "data", label: "data", cells: posture(41, 301, 9, 0) },
  { key: "sandbox", label: "sandbox", sub: "not yet scanned", cells: posture(7, 0, 0, 0) },
];

const children: Record<string, GridRow[]> = {
  payments: [
    { key: "payments/api", label: "payments/api", cells: posture(1, 9, 1, 0) },
    { key: "payments/web", label: "payments/web", cells: posture(1, 7, 2, 1) },
    { key: "payments/ledger", label: "payments/ledger", cells: posture(1, 10, 0, 0) },
  ],
  web: [
    { key: "web/site", label: "web/site", cells: posture(1, 4, 5, 1) },
    { key: "web/cdn", label: "web/cdn", cells: posture(1, 6, 3, 1) },
  ],
};

const meta = {
  title: "Blocks/GroupGrid",
  component: GroupGrid,
  args: {
    heading: "Org / repository",
    label: "Checks by org",
    columns,
    rows,
    heat: ["failing"],
    open: ["payments"],
    onToggle: () => {},
    children: () => null,
    footer: { label: "All orgs", cells: posture(270, 1693, 300, 52) },
  },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    children: { control: false },
    footer: { control: false },
    open: { control: false },
    heat: { control: "check", options: ["passing", "failing", "waived"] },
  },
  // The open rows are the page's state; here a local state stands in for the URL.
  render: function Render(args) {
    const [open, setOpen] = useState<readonly string[]>(args.open);
    return (
      <GroupGrid
        {...args}
        open={open}
        onToggle={(key) =>
          setOpen((now) => (now.includes(key) ? now.filter((k) => k !== key) : [...now, key]))
        }
      >
        {(row) => (
          <GridChildRows
            parent={row.key}
            rows={children[row.key] ?? []}
            empty="No repositories."
            footer={row.key === "payments" ? "showing 3 of 134" : undefined}
          />
        )}
      </GroupGrid>
    );
  },
} satisfies Meta<typeof GroupGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A cell with a denominator prints its count and its share; a shaded
 * column tints each cell by that share. A zero denominator is "no data".
 */
export const Default: Story = {};

/** Any measured column can carry the heat, in its own tone. */
export const HeatOnEveryColumn: Story = { args: { heat: ["passing", "failing", "waived"] } };

export const WithoutHeat: Story = { args: { heat: [] } };

/** A group that is still fetching its children. */
export const LoadingChildren: Story = {
  render: (args) => (
    <GroupGrid {...args} open={["web"]}>
      {(row) => <GridChildRows parent={row.key} rows={[]} loading />}
    </GroupGrid>
  ),
};
